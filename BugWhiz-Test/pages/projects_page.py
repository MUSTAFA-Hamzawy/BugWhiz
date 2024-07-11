from .base_page import BasePage
from selenium.webdriver.common.by import By

class ProjectsPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.logo = "//img[@alt='BugWhiz Logo']"
        self.projects_tab = "//a[@class='Header_active__2HOLV']"
        self.create_project_button = "//button[normalize-space()='Create Project']"
        self.project_name_field = "//input[@id='projectName']"
        self.cancel_project_name_button = "//button[normalize-space()='Cancel']"
        self.notification_button = "//body/div[@id='root']/div[@class='App']/div[@class='Header_headerContainer__mE2hL']/div[@class='Header_accountMenuContainer__yStny']/div[@class='MuiBox-root css-5nwj3y']/div[1]//*[name()='svg']"
        self.account_info_button = "//div[@class='MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-1e5gz81-MuiAvatar-root']//*[name()='svg']"

        self.profile_button = "//*[@id='account-menu']/div[3]/ul/li[1]/text()"
        self.logout_button = "//button[normalize-space()='Logout']"
        self.update_project_button = "//tbody/tr[1]/td[2]/button[1]"
        self.delete_project_button = "//tbody/tr[1]/td[2]/button[2]"
        self.view_issues_button = "//tbody/tr[2]/td[2]/button[3]"
        self.page_number = "//button[@aria-label='page 1']"

    def click_create_project_button(self):
        self.driver.find_element(By.XPATH, self.create_project_button).click()

    def click_notification_button(self):
        self.driver.find_element(By.XPATH, self.notification_button).click()

    def click_account_info_button(self):
        self.driver.find_element(By.XPATH, self.account_info_button).click()

    def click_profile_button(self):
        self.driver.find_element(By.NAME, self.profile_button).click()

    def click_logout_button(self):
        self.driver.find_element(By.XPATH, self.logout_button).click()

    def click_update_project_button(self):
        self.driver.find_element(By.XPATH, self.update_project_button).click()

    def click_delete_project_button(self):
        self.driver.find_element(By.XPATH, self.delete_project_button).click()

    def click_view_issues_button(self):
        self.driver.find_element(By.XPATH, self.view_issues_button).click()

    def click_page_number(self):
        self.driver.find_element(By.XPATH, self.page_number).click()

    def get_page_number(self):
        return self.driver.find_element(By.XPATH, self.page_number).text
    
    def get_project_name(self):
        return self.driver.find_element(By.XPATH, self.project_name_field).get_attribute("value")
    
    def enter_project_name(self, project_name):
        self.driver.find_element(By.XPATH, self.project_name_field).send_keys(project_name)

    def navigate_to_profile(self):
        self.click_account_info_button()
        self.click_profile_button()
        