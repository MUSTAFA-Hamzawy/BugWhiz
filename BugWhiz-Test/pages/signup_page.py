from .base_page import BasePage
from selenium.webdriver.common.by import By

class SignupPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.register_link = "//a[@class='Login_signupLink__vIA5c']"
        self.fullname_field = "//input[@id='fullName']"
        self.username_field = "//input[@id='username']"
        self.email_field = "//input[@id='email']"
        self.phone_field = "//input[@id='phoneNumber']"
        self.job_field = "//input[@id='jobTitle']"
        self.password_field = "//input[@id='password']"
        self.confirm_password_field = "//input[@id='confirmPassword']"
        self.signup_button = "//button[@class='Register_button_common__THSL8']"
        self.login_link = "//a[@class='Register_loginLink__PyYqn']"

        # login page locators
        self.username_field_login = "//input[@id='emailOrUsername']"
        self.password_field_login = "//input[@id='password']"
        self.login_button = "//button[@type='submit']"

        # error messages
        self.fullname_error = "//p[normalize-space()='Full Name is required']"
        self.username_error = "//p[normalize-space()='Username is required']"
        self.email_required_error = "//p[normalize-space()='Email is required']"
        self.email_invalid_error = "//p[normalize-space()='This is not a valid email format!']"
        self.phone_error = "//p[normalize-space()='Phone Number is required']"
        self.job_error = "//p[normalize-space()='Job Title is required']"
        self.password_error = "//p[normalize-space()='Password is required']"
        self.password_short_error = "//p[normalize-space()='Password must be more than 4 characters']"
        self.confirm_password_error = "//p[normalize-space()='Confirm Password is required']"
        self.confirm_password_mismatch_error = "//p[normalize-space()='Confirm password and password should be the same']"
        

    def enter_username(self, username):
        self.driver.find_element(By.XPATH, self.username_field).clear()
        self.driver.find_element(By.XPATH, self.username_field).send_keys(username)
                                                                          
    def enter_password(self, password):
        self.driver.find_element(By.XPATH, self.password_field).clear()
        self.driver.find_element(By.XPATH, self.password_field).send_keys(password)

    def click_signup(self):
        self.driver.find_element(By.XPATH, self.signup_button).click()

    def click_login(self):
        self.driver.find_element(By.XPATH, self.login_link).click()

    def enter_fullname(self, fullname):
        self.driver.find_element(By.XPATH, self.fullname_field).clear()
        self.driver.find_element(By.XPATH, self.fullname_field).send_keys(fullname)

    def enter_email(self, email):
        self.driver.find_element(By.XPATH, self.email_field).clear()
        self.driver.find_element(By.XPATH, self.email_field).send_keys(email)

    def enter_phone(self, phone):
        self.driver.find_element(By.XPATH, self.phone_field).clear()
        self.driver.find_element(By.XPATH, self.phone_field).send_keys(phone)

    def enter_job(self, job):
        self.driver.find_element(By.XPATH, self.job_field).clear()
        self.driver.find_element(By.XPATH, self.job_field).send_keys(job)

    def enter_confirm_password(self, confirm_password):
        self.driver.find_element(By.XPATH, self.confirm_password_field).clear()
        self.driver.find_element(By.XPATH, self.confirm_password_field).send_keys(confirm_password)

    def click_register_link(self):
        self.driver.find_element(By.XPATH, self.register_link).click()

    def enter_username_login(self, username):
        self.driver.find_element(By.XPATH, self.username_field_login).clear()
        self.driver.find_element(By.XPATH, self.username_field_login).send_keys(username)

    def enter_password_login(self, password):
        self.driver.find_element(By.XPATH, self.password_field_login).clear()
        self.driver.find_element(By.XPATH, self.password_field_login).send_keys(password)

    def click_login_button(self):
        self.driver.find_element(By.XPATH, self.login_button).click()

    def get_fullname_error(self):
        return self.driver.find_element(By.XPATH, self.fullname_error).text
    
    def get_username_error(self):
        return self.driver.find_element(By.XPATH, self.username_error).text
    
    def get_email_error(self):
        return self.driver.find_element(By.XPATH, self.email_required_error).text
    
    def get_email_invalid_error(self):
        return self.driver.find_element(By.XPATH, self.email_invalid_error).text
    
    def get_phone_error(self):
        return self.driver.find_element(By.XPATH, self.phone_error).text
    
    def get_job_error(self):
        return self.driver.find_element(By.XPATH, self.job_error).text
    
    def get_password_error(self):
        return self.driver.find_element(By.XPATH, self.password_error).text
    
    def get_password_short_error(self):
        return self.driver.find_element(By.XPATH, self.password_short_error).text
    
    def get_confirm_password_error(self):
        return self.driver.find_element(By.XPATH, self.confirm_password_error).text
    
    def get_confirm_password_mismatch_error(self):
        return self.driver.find_element(By.XPATH, self.confirm_password_mismatch_error).text
    
