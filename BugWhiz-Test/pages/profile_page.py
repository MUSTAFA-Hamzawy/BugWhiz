from .base_page import BasePage
from selenium.webdriver.common.by import By

class ProfilePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.logo = "//img[@alt='BugWhiz Logo']"
        self.projects_tab = "//a[normalize-space()='Projects']"
        self.notifications_tab = "//*[name()='path' and contains(@d,'M12 22c1.1')]"
        self.profile_tab = "//div[@class='MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-1e5gz81-MuiAvatar-root']//*[name()='svg']//*[name()='path' and contains(@d,'M12 12c2.2')]"
        self.logout_button = "//button[normalize-space()='Logout']"
        self.name = "//p[@class='MuiTypography-root MuiTypography-body1 Profile_fullName__8XrYo css-ahj2mt-MuiTypography-root']"
        self.email = "//span[normalize-space()='karimmohamed003@gmail.com']"
        self.user_name = "//span[normalize-space()='karimmohamed003']"
        self.phone_number = "//span[normalize-space()='01558446250']"
        self.job_title = "//span[normalize-space()='Student']"

    def click_projects_tab(self):
        self.driver.find_element(By.XPATH, self.projects_tab).click()

    def click_notifications_tab(self):
        self.driver.find_element(By.XPATH, self.notifications_tab).click()

    def click_profile_tab(self):
        self.driver.find_element(By.XPATH, self.profile_tab).click()

    def click_logout_button(self):
        self.driver.find_element(By.XPATH, self.logout_button).click()

    def get_user_name(self):
        return self.driver.find_element(By.XPATH, self.user_name).text
    
    def get_email(self):
        return self.driver.find_element(By.XPATH, self.email).text
    
    def get_phone_number(self):
        return self.driver.find_element(By.XPATH, self.phone_number).text
    
    def get_job_title(self):
        return self.driver.find_element(By.XPATH, self.job_title).text
    
    def click_logo(self):
        self.driver.find_element(By.XPATH, self.logo).click()

    def get_name(self):
        return self.driver.find_element(By.XPATH, self.name).text

