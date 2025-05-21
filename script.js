document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Page 1
  const page1 = document.getElementById("page1")
  const page2 = document.getElementById("page2")
  const page3 = document.getElementById("page3")
  const phoneInput = document.getElementById("phone")
  const verifyBtn = document.getElementById("verifyBtn")
  const checkBtn = document.getElementById("checkBtn")
  const phoneError = document.getElementById("phoneError")

  // DOM Elements - Page 2
  const nameInput = document.getElementById("name")
  const dayInput = document.getElementById("day")
  const monthInput = document.getElementById("month")
  const yearInput = document.getElementById("year")
  const emailInput = document.getElementById("email")
  const noEmailCheckbox = document.getElementById("noEmail")
  const continueBtn = document.getElementById("continueBtn")
  const nameError = document.getElementById("nameError")
  const birthdayError = document.getElementById("birthdayError")
  const emailError = document.getElementById("emailError")


  const summaryPhone = document.getElementById("summaryPhone")
  const summaryName = document.getElementById("summaryName")
  const summaryBirthday = document.getElementById("summaryBirthday")
  const summaryEmail = document.getElementById("summaryEmail")
  const finishBtn = document.getElementById("finishBtn")

  // User data object to store form inputs
  const userData = {
    phone: "",
    name: "",
    birthday: "",
    email: "",
  }

  // Initially disable buttons
  checkBtn.disabled = true
  continueBtn.disabled = true

  // Hide all error messages initially
  hideAllErrors()

  // ===== PAGE 1: PHONE VERIFICATION =====

  // Only allow numerical input for phone
  phoneInput.addEventListener("input", function (e) {
    // Remove any non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, "")

    validatePhone()
  })

  // Verify button click
  verifyBtn.addEventListener("click", () => {
    validatePhone()
  })

  // Check button click
  checkBtn.addEventListener("click", () => {
    if (validatePhone()) {
      // Store the phone number with country code
      userData.phone = "+60" + phoneInput.value

      // Navigate to page 2
      page1.style.display = "none"
      page2.style.display = "flex"
    }
  })

  function validatePhone() {
    const validPhone = "173527250" // The only valid phone number

    if (phoneInput.value === validPhone) {
      // Valid phone number
      verifyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" fill="#F58220" stroke="#F58220" stroke-width="2"/>
                    <path d="M6 10L9 13L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `

      checkBtn.disabled = false
      phoneError.style.display = "none"
      return true
    } else {
      // Invalid phone number
      verifyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#F58220" stroke-width="2"/>
                    <path d="M6 10L9 13L14 7" stroke="#F58220" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `

      checkBtn.disabled = true

      if (phoneInput.value.length > 0) {
        phoneError.style.display = "block"
      } else {
        phoneError.style.display = "none"
      }

      return false
    }
  }

  // ===== PAGE 2: REGISTRATION FORM =====

  // Name validation
  nameInput.addEventListener("input", validateForm)
  nameInput.addEventListener("blur", function () {
    if (!this.value.trim()) {
      nameError.style.display = "block"
    } else {
      nameError.style.display = "none"
    }
  })

  // Birthday validation - only allow numbers
  ;[dayInput, monthInput, yearInput].forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "")
      validateBirthday()
      validateForm()
    })

    input.addEventListener("blur", validateBirthday)
  })

  // Email validation
  emailInput.addEventListener("input", validateForm)
  emailInput.addEventListener("blur", validateEmail)

  // No email checkbox
  noEmailCheckbox.addEventListener("change", function () {
    if (this.checked) {
      emailInput.disabled = true
      emailInput.value = ""
      emailError.style.display = "none"
    } else {
      emailInput.disabled = false
    }
    validateForm()
  })

  // Continue button click
  continueBtn.addEventListener("click", () => {
    if (validateForm(true)) {
      // Store user data
      userData.name = nameInput.value.trim()

      const day = dayInput.value.padStart(2, "0")
      const month = monthInput.value.padStart(2, "0")
      const year = yearInput.value
      userData.birthday = `${day}/${month}/${year}`

      userData.email = noEmailCheckbox.checked ? "No email provided" : emailInput.value.trim()

      // Populate summary page
      summaryPhone.textContent = userData.phone
      summaryName.textContent = userData.name
      summaryBirthday.textContent = userData.birthday
      summaryEmail.textContent = userData.email

      // Navigate to page 3
      page2.style.display = "none"
      page3.style.display = "flex"
    }
  })

  function validateBirthday() {
    const day = Number.parseInt(dayInput.value)
    const month = Number.parseInt(monthInput.value)
    const year = Number.parseInt(yearInput.value)

    const isValid =
      day >= 1 &&
      day <= 31 &&
      month >= 1 &&
      month <= 12 &&
      year >= 1900 &&
      year <= new Date().getFullYear() &&
      dayInput.value &&
      monthInput.value &&
      yearInput.value

    if (!isValid && (dayInput.value || monthInput.value || yearInput.value)) {
      birthdayError.style.display = "block"
    } else {
      birthdayError.style.display = "none"
    }

    return isValid
  }

  function validateEmail() {
    if (noEmailCheckbox.checked) return true

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(emailInput.value)

    if (!isValid && emailInput.value) {
      emailError.style.display = "block"
    } else {
      emailError.style.display = "none"
    }

    return isValid || !emailInput.value
  }

  function validateForm(showErrors = false) {
    // Name validation
    const nameValid = nameInput.value.trim().length > 0
    if (showErrors && !nameValid) {
      nameError.style.display = "block"
    }

    // Birthday validation
    const birthdayValid = validateBirthday()
    if (showErrors && !birthdayValid) {
      birthdayError.style.display = "block"
    }

    // Email validation
    const emailValid = noEmailCheckbox.checked || validateEmail()
    if (showErrors && !emailValid && !noEmailCheckbox.checked) {
      emailError.style.display = "block"
    }

    // Enable/disable continue button
    const formValid = nameValid && birthdayValid && emailValid
    continueBtn.disabled = !formValid

    return formValid
  }

  // ===== PAGE 3: SUMMARY PAGE =====

  finishBtn.addEventListener("click", () => {
    // In a real app, this would submit the data to a server
    alert("Registration completed successfully!")

    // Reset and go back to page 1
    resetForm()
    page3.style.display = "none"
    page1.style.display = "flex"
  })

  // Helper functions
  function hideAllErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    errorElements.forEach((el) => (el.style.display = "none"))
  }

  function resetForm() {
    // Reset page 1
    phoneInput.value = ""
    verifyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#F58220" stroke-width="2"/>
                <path d="M6 10L9 13L14 7" stroke="#F58220" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
    checkBtn.disabled = true

    // Reset page 2
    nameInput.value = ""
    dayInput.value = ""
    monthInput.value = ""
    yearInput.value = ""
    emailInput.value = ""
    emailInput.disabled = false
    noEmailCheckbox.checked = false
    continueBtn.disabled = true

    // Hide all error messages
    hideAllErrors()

    // Reset user data
    Object.keys(userData).forEach((key) => (userData[key] = ""))
  }
})
