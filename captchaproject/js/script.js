(function () {
    const fonts = ["cursive", "sans-serif", "serif", "monospace"];
    let captchaValue = "";

    function generateCaptcha() {
        let value = btoa(Math.random() * 1000000000);
        value = value.substr(0, 5 + Math.random() * 5);
        captchaValue = value;
    }

    function setCaptcha() {
        let html = captchaValue
            .split("")
            .map((char) => {
                const rotate = -20 + Math.trunc(Math.random() * 30);
                const font = Math.trunc(Math.random() * fonts.length);
                return `<span style="display:inline-block;transform:rotate(${rotate}deg);font-family:${fonts[font]};">${char}</span>`;
            })
            .join("");
        document.querySelector(".preview").innerHTML = html;
    }

    function refreshCaptcha() {
        generateCaptcha();
        setCaptcha();
    }

    document.querySelector(".captcha-refresh").addEventListener("click", refreshCaptcha);
    document.querySelector("#login-btn").addEventListener("click", function () {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const captchaInput = document.getElementById("captcha-input").value;

        if (!username || !password || !captchaInput) {
            swal("Error", "Please fill in all fields.", "error");
            return;
        }

        if (captchaInput !== captchaValue) {
            swal("Error", "Captcha does not match.", "error");
            return;
        }

        // Add your login logic here (e.g., AJAX request to your server)
        swal("Success", "Logged in successfully!", "success").then(() => {
            // Redirect to the geolocation page after successful login
            window.location.href = "geolocation.html";
        });
    });

    // Generate and display the initial captcha
    refreshCaptcha();
})();
