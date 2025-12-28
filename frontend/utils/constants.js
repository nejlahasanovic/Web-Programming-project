let Constants = {
   PROJECT_BASE_URL: function() {
      if(location.hostname === "localhost") {
         return "http://localhost/90minut/backend/";
      } else {
         return "https://seal-app-rt82q.ondigitalocean.app/";
      }
   },
   USER_ROLE: "user",
   ADMIN_ROLE: "admin"
}
