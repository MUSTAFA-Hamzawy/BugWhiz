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
        self.profile_button = "//button[normalize-space()='Profile']"
        self.logout_button = "//button[normalize-space()='Logout']"
        self.update_project_button = "//tbody/tr[1]/td[2]/button[1]"
        self.delete_project_button = "//tbody/tr[1]/td[2]/button[2]"
        self.view_issues_button = "//tbody/tr[2]/td[2]/button[3]"
        self.page_number = "//button[@aria-label='page 1']"

    def click_create_project_button(self):
        self.click((By.XPATH, self.create_project_button))

    def click_notification_button(self):
        self.click((By.XPATH, self.notification_button))

    def click_account_info_button(self):
        self.click((By.XPATH, self.account_info_button))

    def click_profile_button(self):
        self.click((By.XPATH, self.profile_button))

    def click_logout_button(self):
        self.click((By.XPATH, self.logout_button))

    def click_update_project_button(self):
        self.click((By.XPATH, self.update_project_button))

    def click_delete_project_button(self):
        self.click((By.XPATH, self.delete_project_button))

    def click_view_issues_button(self):
        self.click((By.XPATH, self.view_issues_button))

    def click_page_number(self):
        self.click((By.XPATH, self.page_number))

    def get_page_number(self):
        return self.get_text((By.XPATH, self.page_number))
    
    def get_project_name(self):
        return self.get_text((By.XPATH, self.project_name_field))
    
    def enter_project_name(self, project_name):
        self.enter_text((By.XPATH, self.project_name_field), project_name)
