// formHandler.js

// === Contact Form Handler ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value, 
        message: form.message.value,
      };

      try {
        const response = await fetch("https://harshgill-portfolio.onrender.com/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("✅ Server Response:", result);

        if (result.success) {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert("Failed to send message.");
        }
      } catch (err) {
        console.error("❌ Error sending form:", err);
        alert("Error occurred while sending.");
      }
    });
  }
});

// === Read More Toggle for Service Cards ===
document.addEventListener("DOMContentLoaded", () => {
  const readMoreButtons = document.querySelectorAll('.card button');

  readMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.parentElement;
      const moreText = card.querySelector('.more-text');

      if (moreText.classList.contains('hidden')) {
        moreText.classList.remove('hidden');
        button.textContent = "Read Less";
      } else {
        moreText.classList.add('hidden');
        button.textContent = "Read More";
      }
    });
  });
});

// === Navbar Menu Toggle (Mobile) ===
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
