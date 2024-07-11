from .base_page import BasePage
from selenium.webdriver.common.by import By
import time

class LoginPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.username_field = "//input[@id='emailOrUsername']"
        self.password_field = "//input[@id='password']"
        self.login_button = "//button[@type='submit']"

    def enter_username(self, username):
        self.driver.find_element(By.XPATH, self.username_field).send_keys(username)

    def enter_password(self, password):
        self.driver.find_element(By.XPATH, self.password_field).send_keys(password)

    def click_login(self):
        self.driver.find_element(By.XPATH, self.login_button).click()

    def login(self):
        self.enter_username("karimmohamed003")
        self.enter_password("Karim123")
        self.click_login()
        time.sleep(2)