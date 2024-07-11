from .base_page import BasePage
from selenium.webdriver.common.by import By

class IssuesPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.logout_button = "//img[@alt='BugWhiz Logo']"
        self.projects_tab = "a[href='/Projects']"
        self.create_project_button = "//button[normalize-space()='Create Project']"
        self.notifications_tab = "//*[name()='path' and contains(@d,'M12 22c1.1')]"
        self.profile_tab = "//div[@class='MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-1e5gz81-MuiAvatar-root']//*[name()='svg']//*[name()='path' and contains(@d,'M12 12c2.2')]"
        self.logout_button = "//button[normalize-space()='Logout']"
        self.create_issue_button = "//button[normalize-space()='Create Issue']"
        self.project_name = "//span[normalize-space()='Projects / ARM-Cortex-A57']"
        self.search_field = "//input[@id=':r9:']"
        self.progress_filter = "//input[@id=':r9:']"
        self.priority_filter = "//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary Mui-focused Issues_filterSelect__UugjT css-1yk1gt9-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root']//div[@role='combobox'][normalize-space()='None']"
        self.category_filter = "//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary Mui-focused Issues_filterSelect__UugjT css-1yk1gt9-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root']//div[@role='combobox'][normalize-space()='None']"
        self.search_button = "//button[normalize-space()='Search']"
        self.view_all_issues_button = "//button[normalize-space()='View All Issues']"
        self.issue_name = "//span[@class='Issues_issueLink__xoSkL']"
        self.issue_title = "//span[@class='Issues_issueText__Ys1GL']"
        self.issue_status = "//span[normalize-space()='TODO']"
        self.issue_priority = "//span[normalize-space()='P1']"
        self.issue_category = "//span[normalize-space()='None']"
        self.issue_view_details_button = "//button[normalize-space()='View Details']"
        self.delete_issue_button = "//button[@class='Issues_deleteButton__51phL']"

    def click_projects_tab(self):
        self.driver.find_element(By.CSS_SELECTOR, self.projects_tab).click()

    def click_create_project_button(self):
        self.driver.find_element(By.XPATH, self.create_project_button).click()

    def click_notifications_tab(self):
        self.driver.find_element(By.XPATH, self.notifications_tab).click()

    def click_profile_tab(self):
        self.driver.find_element(By.XPATH, self.profile_tab).click()

    def click_logout_button(self):
        self.driver.find_element(By.XPATH, self.logout_button).click()

    def click_create_issue_button(self):
        self.driver.find_element(By.XPATH, self.create_issue_button).click()

    def click_project_name(self):
        self.driver.find_element(By.XPATH, self.project_name).click()

    def enter_search_field(self, search_text):
        self.driver.find_element(By.XPATH, self.search_field).clear()
        self.driver.find_element(By.XPATH, self.search_field).send_keys(search_text)

    def click_search_button(self):
        self.driver.find_element(By.XPATH, self.search_button).click()

    def click_view_all_issues_button(self):
        self.driver.find_element(By.XPATH, self.view_all_issues_button).click()

    def click_issue_name(self):
        self.driver.find_element(By.XPATH, self.issue_name).click()

    def click_issue_view_details_button(self):
        self.driver.find_element(By.XPATH, self.issue_view_details_button).click()

    def click_delete_issue_button(self):
        self.driver.find_element(By.XPATH, self.delete_issue_button).click()

    def get_issue_title(self):
        return self.driver.find_element(By.XPATH, self.issue_title).text
    
    def get_issue_status(self):
        return self.driver.find_element(By.XPATH, self.issue_status).text

    def get_issue_priority(self):
        return self.driver.find_element(By.XPATH, self.issue_priority).text
    
    def get_issue_category(self):
        return self.driver.find_element(By.XPATH, self.issue_category).text
    
    def get_search_field_text(self):
        return self.driver.find_element(By.XPATH, self.search_field).get_attribute('value')
    
    def get_project_name(self):
        return self.driver.find_element(By.XPATH, self.project_name).text
    
    def get_issue_name(self):
        return self.driver.find_element(By.XPATH, self.issue_name).text
    