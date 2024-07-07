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

    def enter_username(self, username):
        self.driver.find_element(By.XPATH, self.username_field).send_keys(username)
                                                                          
    def enter_password(self, password):
        self.driver.find_element(By.XPATH, self.password_field).send_keys(password)

    def click_signup(self):
        self.driver.find_element(By.XPATH, self.signup_button).click()

    def click_login(self):
        self.driver.find_element(By.XPATH, self.login_link).click()

    def enter_fullname(self, fullname):
        self.driver.find_element(By.XPATH, self.fullname_field).send_keys(fullname)

    def enter_email(self, email):
        self.driver.find_element(By.XPATH, self.email_field).send_keys(email)

    def enter_phone(self, phone):
        self.driver.find_element(By.XPATH, self.phone_field).send_keys(phone)

    def enter_job(self, job):
        self.driver.find_element(By.XPATH, self.job_field).send_keys(job)

    def enter_confirm_password(self, confirm_password):
        self.driver.find_element(By.XPATH, self.confirm_password_field).send_keys(confirm_password)

    def click_register_link(self):
        self.driver.find_element(By.XPATH, self.register_link).click()
