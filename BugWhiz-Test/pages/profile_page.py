from .base_page import BasePage
from selenium.webdriver.common.by import By

class ProfilePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.logo = "//img[@alt='BugWhiz Logo']"
        self.projects_tab = "//a[normalize-space()='Projects']"
        self.notifications_tab = "//*[@id='root']/div/div[1]/div[3]/div/div/svg"
        self.profile_tab = "//div[@class='MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-1e5gz81-MuiAvatar-root']//*[name()='svg']//*[name()='path' and contains(@d,'M12 12c2.2')]"
        self.logout_button = "//*[@id='root']/div/div[1]/div[3]/button"
        self.name = "//*[@id='root']/div/div[2]/div[2]/p"
        self.email = "//*[@id='root']/div/div[2]/div[2]/div/div[1]/span[2]"
        self.user_name = "//*[@id='root']/div/div[2]/div[2]/div/div[2]/span[2]"
        self.phone_number = "//*[@id='root']/div/div[2]/div[2]/div/div[3]/span[2]"
        self.job_title = "//*[@id='root']/div/div[2]/div[2]/div/div[4]/span[2]"

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

