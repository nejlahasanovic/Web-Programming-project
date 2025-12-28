let UserManagementService = {
  allUsers: [], 

  init: function () {
   
    $("#add-user-form").validate({
      rules: {
        username: { 
          required: true, 
          minlength: 7, 
          maxlength: 50
        },
        email: { 
          required: true, 
          email: true 
        },
        password_hash: { 
          required: true, 
          minlength: 8,  
          maxlength: 20
        },
        role: { 
          required: true 
        }
      },
      messages: {
        username: {
          required: "Please enter username",
          minlength: "Username must be at least 7 characters",  
          maxlength: "Username cannot exceed 50 characters"
        },
        email: {
          required: "Please enter email address",
          email: "Please enter a valid email"
        },
        password_hash: {
          required: "Please enter password",
          minlength: "Password must be at least 8 characters (with uppercase, number, special char)",  
          maxlength: "Password cannot exceed 20 characters"
        },
        role: {
          required: "Please select a role"
        }
      },
      submitHandler: function (form) {
        var user = Object.fromEntries(new FormData(form).entries());
        UserManagementService.addUser(user);
        form.reset();
      }
    });

    
    $("#edit-user-form").validate({
      rules: {
        username: { 
          required: true, 
          minlength: 7,  
          maxlength: 50
        },
        email: { 
          required: true, 
          email: true 
        },
        password_hash: { 
          minlength: 8, 
          maxlength: 20
        },
        role: { 
          required: true 
        }
      },
      messages: {
        username: {
          required: "Please enter username",
          minlength: "Username must be at least 7 characters",  
          maxlength: "Username cannot exceed 50 characters"
        },
        email: {
          required: "Please enter email address",
          email: "Please enter a valid email"
        },
        password_hash: {
          minlength: "Password must be at least 8 characters (leave empty to keep current)",  
          maxlength: "Password cannot exceed 20 characters"
        },
        role: {
          required: "Please select a role"
        }
      },
      submitHandler: function (form) {
        var user = Object.fromEntries(new FormData(form).entries());
        
        if (!user.password_hash || user.password_hash.trim() === '') {
          delete user.password_hash;
        }
        
        UserManagementService.editUser(user);
      }
    });

    $("#role-filter").on("change", function() {
      UserManagementService.applyFilters();
    });

    $("#sort-filter").on("change", function() {
      UserManagementService.applyFilters();
    });

    UserManagementService.getAllUsers();
  },

  getAllUsers: function () {
    $.blockUI({ message: '<h3>Loading users...</h3>' });

    RestClient.get(
      "users",
      function (data) {
        const users = Array.isArray(data) ? data : (data.data || []);
        UserManagementService.allUsers = users;
        
        UserManagementService.updateStats(users);
        UserManagementService.applyFilters();
        
        $.unblockUI();
      },
      function (jqXHR) {
        console.error("Error loading users:", jqXHR);
        $.unblockUI();
        toastr.error("Cannot load users");
      }
    );
  },

  updateStats: function(users) {
    const total = users.length;
    
    $('#totalUsers').text(total);
    $('#activeUsers').text('0');
    $('#newUsers').text('0');
    $('#bannedUsers').text('0');
  },

  applyFilters: function() {
    let filtered = [...UserManagementService.allUsers];

    const roleFilter = $("#role-filter").val();
    if (roleFilter && roleFilter !== '') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    const sortFilter = $("#sort-filter").val();
    if (sortFilter === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortFilter === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortFilter === 'alphabetical') {
      filtered.sort((a, b) => a.username.localeCompare(b.username));
    }

    UserManagementService.renderUsersTable(filtered);
  },

  renderUsersTable: function(users) {
    Utils.datatable('users-table', [
      { 
        data: null,
        title: '<input type="checkbox" id="selectAll">',
        orderable: false,
        width: '30px',
        render: function() {
          return '<input type="checkbox" class="row-checkbox">';
        }
      },
      { 
        data: 'username', 
        title: 'Username',
        render: function(data, type, row) {
          return `
            <div class="user-info">
              <strong>${data}</strong>
              <span class="user-id text-muted"> #${row.user_id}</span>
            </div>
          `;
        }
      },
      { 
        data: 'email', 
        title: 'Email'
      },
      { 
        data: 'role', 
        title: 'Role',
        render: function(data) {
          const badges = {
            'admin': '<span class="badge badge-danger"><i class="fa fa-star"></i> Admin</span>',
            'editor': '<span class="badge badge-primary"><i class="fa fa-pencil"></i> Editor</span>',
            'user': '<span class="badge badge-secondary"><i class="fa fa-user"></i> User</span>'
          };
          return badges[data] || `<span class="badge badge-light">${data}</span>`;
        }
      },
      { 
        data: 'created_at', 
        title: 'Created At',
        render: function(data) {
          if (!data) return 'N/A';
          const date = new Date(data);
          return date.toLocaleDateString('en-GB');
        }
      },
      {
        title: 'Actions',
        orderable: false,
        render: function (data, type, row) {
          const rowStr = encodeURIComponent(JSON.stringify(row));
          
          return `
            <div class="action-buttons">
              <button class="btn-icon btn-edit" title="Edit" onclick="UserManagementService.openEditModal('${row.user_id}')">
                <i class="fa fa-edit"></i>
              </button>
              <button class="btn-icon btn-delete" title="Delete" onclick="UserManagementService.openConfirmationDialog(decodeURIComponent('${rowStr}'))">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          `;
        }
      }
    ], users, 10);
  },

  openAddModal: function () {
    $("#add-user-modal").modal("show");
    $("#add-user-form")[0].reset();
    $("#add-user-form").validate().resetForm();
  },

  addUser: function (user) {
    $.blockUI({ message: '<h3>Saving user...</h3>' });

    RestClient.post(
      "users",
      user,
      function (response) {
        console.log("User added:", response);
        $.unblockUI();
        $("#add-user-modal").modal("hide");
        toastr.success("User added successfully!");
        UserManagementService.getAllUsers();
      },
      function (jqXHR) {
        console.error("Error adding user:", jqXHR);
        $.unblockUI();
        toastr.error(jqXHR.responseText || "Error adding user");
      }
    );
  },

  openEditModal: function (id) {
    $.blockUI({ message: '<h3>Loading user...</h3>' });

    RestClient.get(
      "users/" + id,
      function (user) {
        console.log("User loaded for edit:", user);

        $("#edit-user-id").val(user.user_id);
        $("#edit-user-username").val(user.username);
        $("#edit-user-email").val(user.email);
        $("#edit-user-role").val(user.role);
        $("#edit-user-password").val('');

        $.unblockUI();
        $("#edit-user-modal").modal("show");
        $("#edit-user-form").validate().resetForm();
      },
      function (jqXHR) {
        console.error("Error loading user:", jqXHR);
        $.unblockUI();
        toastr.error("Cannot load user");
      }
    );
  },

  editUser: function (user) {
    $.blockUI({ message: '<h3>Updating user...</h3>' });

    RestClient.put(
      "users/" + user.user_id,
      user,
      function (response) {
        console.log("User updated:", response);
        $.unblockUI();
        $("#edit-user-modal").modal("hide");
        toastr.success("User updated successfully!");
        UserManagementService.getAllUsers();
      },
      function (jqXHR) {
        console.error("Error updating user:", jqXHR);
        $.unblockUI();
        toastr.error(jqXHR.responseText || "Error updating user");
      }
    );
  },

  openConfirmationDialog: function (userJson) {
    const user = JSON.parse(userJson);
    console.log("Opening delete confirmation for:", user);

    $("#confirm-delete-user-modal .modal-body").html(
      `Are you sure you want to delete user: <strong>${user.username}</strong> (${user.email})?`
    );

    $("#confirm-delete-user-btn")
      .off("click")
      .on("click", function () {
        UserManagementService.deleteUser(user.user_id);
      });

    $("#confirm-delete-user-modal").modal("show");
  },

  deleteUser: function (id) {
    $.blockUI({ message: '<h3>Deleting user...</h3>' });

    RestClient.delete(
      "users/" + id,
      null,
      function (response) {
        console.log("User deleted:", response);
        $.unblockUI();
        $("#confirm-delete-user-modal").modal("hide");
        toastr.success("User deleted successfully!");
        UserManagementService.getAllUsers();
      },
      function (jqXHR) {
        console.error("Error deleting user:", jqXHR);
        $.unblockUI();
        toastr.error(jqXHR.responseText || "Error deleting user");
      }
    );
  }
};