const input = document.querySelector("input"),
        showHide = document.querySelector(".show_hide"),
        indicator = document.querySelector(".indicator"),
        iconText = document.querySelector(".icon-text"),
        text = document.querySelector(".text");

showHide.addEventListener("click", ()=>{
    if(input.type === "password"){
      input.type = "text";
      showHide.classList.replace("fa-eye-slash","fa-eye");
    }else {
      input.type = "password";
      showHide.classList.replace("fa-eye","fa-eye-slash");
    }
  });
