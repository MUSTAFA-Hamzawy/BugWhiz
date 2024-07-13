from .base_page import BasePage
from selenium.webdriver.common.by import By
import time

class ProjectsPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.logo = "//img[@alt='BugWhiz Logo']"
        self.projects_tab = "//a[@class='Header_active__cG4iu']"

        self.project_name_field = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[2]/td[1]/span"

        self.first_project_name = " //*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[1]/span"
        self.create_project_button = "//button[normalize-space()='Create Project']"
        self.cancel_project_name_button = "/html/body/div[3]/div[3]/div[2]/button[2]"
        
        self.submit_project_name_button = "/html/body/div[3]/div[3]/div[2]/button[1]"

        self.notification_button = "//*[@id='root']/div/div[1]/div[3]/div/div/button/span[1]/svg"

        self.first_notification = "//*[@id='notification-menu']/div[3]/ul/li[2]/div/p"

        self.account_info_button = "//*[@id='root']/div/div[1]/div[3]/div/button/div/img"
        self.profile_button = "//*[@id='account-menu']/div[3]/ul/li[1]"

        self.logout_button = "//*[@id='root']/div/div[1]/div[3]/button"

        self.update_project_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[2]/button[1]"
        self.update_project_field = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[1]/div/input"
        self.submit_update_project_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[1]/div/button[1]"
        self.cancel_update_project_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[1]/div/button[2]"

        self.delete_project_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[2]/button[2]"
        self.confirm_delete_project_button = "body > div.MuiModal-root.css-79ws1d-MuiModal-root > div.MuiBox-root.css-1wnsr1i > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-colorPrimary.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.MuiButton-colorPrimary.Projects_okButton__bzci0.css-1e6y48t-MuiButtonBase-root-MuiButton-root"
        self.cancel_delete_project_button = "/html/body/div[3]/div[3]/div/button[2]"

        self.view_issues_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[2]/button[3]"

        self.page_number = "//*[@id='root']/div/div[2]/div[2]/div/nav/ul/li[3]/button"
        self.next_page_button = "//*[@id='root']/div/div[2]/div[2]/div/nav/ul/li[5]/button/svg"
        self.previous_page_button = "//*[@id='root']/div/div[2]/div[2]/div/nav/ul/li[1]/button/svg"

        self.add_user_to_project_field = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[3]/div/input"
        self.add_user_to_project_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[3]/div/button[1]"
        self.clear_user_from_project_field = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[3]/div/button[2]"
        self.user_not_found = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[3]/span"
        self.user_already_assigned_to_project = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[3]/span"

        self.analytics_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr[1]/td[4]/button"

        self.no_projects_yet = "//*[@id='root']/div/div[2]/div[2]/div"

    def click_create_project_button(self):
        self.driver.find_element(By.XPATH, self.create_project_button).click()

    def click_notification_button(self):
        self.driver.find_element(By.XPATH, self.notification_button).click()

    def click_account_info_button(self):
        self.driver.find_element(By.XPATH, self.account_info_button).click()

    def click_logout_button(self):
        self.driver.find_element(By.XPATH, self.logout_button).click()

    def click_update_project_button(self):
        self.driver.find_element(By.XPATH, self.update_project_button).click()

    def click_delete_project_button(self):
        self.driver.find_element(By.XPATH, self.delete_project_button).click()

    def click_view_issues_button(self):
        self.driver.find_element(By.XPATH, self.view_issues_button).click()

    def get_page_number(self):
        return self.driver.find_element(By.XPATH, self.page_number).text
    
    def get_project_name(self):
        return self.driver.find_element(By.XPATH, self.first_project_name).text
    
    def enter_project_name(self, project_name, project_number):
        self.project_name_field = self.project_name_field.replace("1", project_number)
        self.driver.find_element(By.XPATH, self.project_name_field).clear()
        self.driver.find_element(By.XPATH, self.project_name_field).send_keys(project_name)

    def click_submit_project_name_button(self):
        self.driver.find_element(By.XPATH, self.submit_project_name_button).click()

    def click_cancel_project_name_button(self):
        self.driver.find_element(By.XPATH, self.cancel_project_name_button).click()

    def get_first_notification(self):
        return self.driver.find_element(By.XPATH, self.first_notification).text

    def enter_update_project_field(self, project_name):
        self.driver.find_element(By.XPATH, self.update_project_field).clear()
        time.sleep(1)
        self.driver.find_element(By.XPATH, self.update_project_field).send_keys(project_name)
        time.sleep(1)

    def click_submit_update_project_button(self):
        self.driver.find_element(By.XPATH, self.submit_update_project_button).click()

    def click_cancel_update_project_button(self):
        self.driver.find_element(By.XPATH, self.cancel_update_project_button).click()

    def click_confirm_delete_project_button(self):
        self.driver.find_element(By.CSS_SELECTOR, self.confirm_delete_project_button).click()

    def click_cancel_delete_project_button(self):
        self.driver.find_element(By.XPATH, self.cancel_delete_project_button).click()

    def click_next_page_button(self):
        self.driver.find_element(By.XPATH, self.next_page_button).click()

    def click_previous_page_button(self):
        self.driver.find_element(By.XPATH, self.previous_page_button).click()

    def get_user_not_found_text(self):
        return self.driver.find_element(By.XPATH, self.user_not_found).text

    def get_user_already_assigned_to_project_text(self):
        return self.driver.find_element(By.XPATH, self.user_already_assigned_to_project).text

    def enter_add_user_to_project_field(self, user_email):
        self.driver.find_element(By.XPATH, self.add_user_to_project_field).clear()
        self.driver.find_element(By.XPATH, self.add_user_to_project_field).send_keys(user_email)

    def click_add_user_to_project_button(self):
        self.driver.find_element(By.XPATH, self.add_user_to_project_button).click()

    def click_clear_user_from_project_field(self):
        self.driver.find_element(By.XPATH, self.clear_user_from_project_field).click()

    def user_from_project_field_is_cleared(self):
        return self.driver.find_element(By.XPATH, self.add_user_to_project_field).text
    
    def click_analytics_button(self):
        self.driver.find_element(By.XPATH, self.analytics_button).click()

    def navigate_to_previous_page_from_browser(self):
        self.driver.back()

    def navigate_to_project(self):
        self.driver.find_element(By.XPATH, self.project_name_field).click()

    def get_first_notification(self):
        return self.driver.find_element(By.XPATH, self.first_notification).text