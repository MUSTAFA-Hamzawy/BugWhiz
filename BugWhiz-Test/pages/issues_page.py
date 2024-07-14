from .base_page import BasePage
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class IssuesPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        
        self.logout_button = "//img[@alt='BugWhiz Logo']"
        self.view_issues_button = "//button[contains(text(),'View Issues')]"
        self.create_issue_button = "//button[contains(text(),'Create Issue')]"
        self.issue_name_field = "name"
        self.issue_title_field = "title"
        self.issue_description_field_legend = "//span[contains(text(),'Description')]/parent::*/parent::*/parent::*/child::input"
        self.issue_cancel_button = "//button[contains(text(),'Cancel')]"
        self.issue_submit_button = "//button[contains(text(),'OK')]"
        self.no_issue_yet = "//div[contains(text(),'No issues yet')]"
        self.select_developer_field = "//h3[contains(text(),'Predicted Developers')]/parent::*/child::*/select"
        self.assign_button = "//button[contains(text(),'Assign')]"
        self.cancel_assign_button = "//button[contains(text(),'Cancel')]"
        self.issue_assigned = "//div[contains(text(),'Assigned')]"
        self.view_created_issue_details_button = "//button[contains(text(),'View created issue Details')]"
        self.ticket_name_is_required = "//span[contains(text(),'Ticket Name is required.')]"
        self.ticket_title_is_required = "//span[contains(text(),'Ticket Title is required.')]"
        self.ticket_description_is_required = "//span[contains(text(),'Ticket Description is required.')]"

        # issues details data
        self.issue1_name = "//span[contains(text(),'Issue Name 1')]"
        self.issue1_title = "//span[contains(text(),'Issue Title 1')]"
        self.issue1_status = "//span[contains(text(),'TODO')]"
        self.issue1_priority = "//span[contains(text(),'P1')]"
        self.issue1_category = "//span[contains(text(),'Frontend')]"
        self.issue2_name = "//span[contains(text(),'Issue Name 2')]"
        self.issue2_title = "//span[contains(text(),'Issue Title 2')]"
        self.issue2_status = "//span[contains(text(),'In Progress')]"
        self.issue2_priority = "//span[contains(text(),'P2')]"
        self.issue2_category = "//span[contains(text(),'Backend')]"
        self.issue3_name = "//span[contains(text(),'Issue Name 3')]"
        self.issue3_title = "//span[contains(text(),'Issue Title 3')]"
        self.issue3_status = "//span[contains(text(),'Done')]"
        self.issue3_priority = "//span[contains(text(),'P3')]"
        self.issue3_category = "//span[contains(text(),'Security')]"
        self.issue4_name = "//span[contains(text(),'Issue Name 4')]"
        self.issue4_title = "//span[contains(text(),'Issue Title 4')]"
        self.issue4_status = "//span[contains(text(),'Done')]"
        self.issue4_priority = "//span[contains(text(),'P4')]"
        self.issue4_category = "//span[contains(text(),'Documentation')]"
        
        # search issue
        self.search_status_field = "//body/div[@id='root']/div[1]/div[2]/div[3]/div[2]"
        self.search_status_list = "/html[1]/body[1]/div[3]/div[3]/ul[1]"
        self.search_priority_field = "//body/div[@id='root']/div[1]/div[2]/div[3]/div[3]"
        self.search_priority_list = "/html[1]/body[1]/div[3]/div[3]/ul[1]"
        self.search_category_field = "//body/div[@id='root']/div[1]/div[2]/div[3]/div[4]"
        self.search_category_list = "/html[1]/body[1]/div[3]/div[3]/ul[1]"
        self.search_button = "//button[contains(text(),'Search')]"
        self.search_field = "/html[1]/body[1]/div[1]/div[1]/div[2]/div[3]/div[1]/div[1]/input[1]"

        self.todo_selection ="//body/div[@id='menu-']/div[3]/ul[1]/li[2]"
        self.in_progress_selection ="//body/div[@id='menu-']/div[3]/ul[1]/li[3]"
        self.done_selection ="//body/div[@id='menu-']/div[3]/ul[1]/li[4]"

        self.p1_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[2]"
        self.p2_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[3]"
        self.p3_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[4]"
        self.p4_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[5]"
        self.p5_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[6]"

        self.frontend_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[2]"
        self.backend_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[3]"
        self.security_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[4]"
        self.documentation_selection = "//body/div[@id='menu-']/div[3]/ul[1]/li[5]"


    def navigate_to_issues_page(self):
        self.driver.find_element(By.XPATH, self.view_issues_button).click()

    def navigate_to_create_issue_page(self):
        self.driver.find_element(By.XPATH, self.create_issue_button).click()

    def add_issue_name(self, issue_name):
        self.driver.find_element(By.NAME, self.issue_name_field).clear()
        self.driver.find_element(By.NAME, self.issue_name_field).send_keys(issue_name)

    def add_issue_title(self, issue_title):
        self.driver.find_element(By.NAME, self.issue_name_field).clear()
        self.driver.find_element(By.NAME, self.issue_title_field).send_keys(issue_title)

    def add_issue_description(self, issue_description):
        self.driver.find_element(By.XPATH, self.issue_description_field_legend).clear()
        self.driver.find_element(By.XPATH, self.issue_description_field_legend).send_keys(issue_description)

    def click_cancel_button(self):
        self.driver.find_element(By.XPATH, self.issue_cancel_button).click()

    def click_submit_button(self):
        self.driver.find_element(By.XPATH, self.issue_submit_button).click()

    def get_no_issue_yet_text(self):
        return self.driver.find_element(By.XPATH, self.no_issue_yet).text
    
    def select_developer(self, developer):
        WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, self.select_developer_field)))
        self.driver.find_element(By.XPATH, self.select_developer_field).click()
        self.driver.find_element(By.XPATH, "//option[contains(text(),'"+developer+"')]").click()

    def click_assign_button(self):
        self.driver.find_element(By.XPATH, self.assign_button).click()

    def click_cancel_assign_button(self):
        self.driver.find_element(By.XPATH, self.cancel_assign_button).click()

    def click_view_created_issue_details_button(self):
        self.driver.find_element(By.XPATH, self.view_created_issue_details_button).click()

    def get_ticket_name_is_required_text(self):
        return self.driver.find_element(By.XPATH, self.ticket_name_is_required).text
    
    def get_ticket_title_is_required_text(self):
        return self.driver.find_element(By.XPATH, self.ticket_title_is_required).text
    
    def get_ticket_description_is_required_text(self):
        return self.driver.find_element(By.XPATH, self.ticket_description_is_required).text
    
    def get_issue1_name(self):
        return self.driver.find_element(By.XPATH, self.issue1_name).text
    
    def get_issue1_title(self):
        return self.driver.find_element(By.XPATH, self.issue1_title).text
    
    def get_issue1_status(self):
        return self.driver.find_element(By.XPATH, self.issue1_status).text
    
    def get_issue1_priority(self):
        return self.driver.find_element(By.XPATH, self.issue1_priority).text
    
    def get_issue1_category(self):
        return self.driver.find_element(By.XPATH, self.issue1_category).text
    
    def get_issue2_name(self):
        return self.driver.find_element(By.XPATH, self.issue2_name).text
    
    def get_issue2_title(self):
        return self.driver.find_element(By.XPATH, self.issue2_title).text
    
    def get_issue2_status(self):
        return self.driver.find_element(By.XPATH, self.issue2_status).text
    
    def get_issue2_priority(self):
        return self.driver.find_element(By.XPATH, self.issue2_priority).text
    
    def get_issue2_category(self):
        return self.driver.find_element(By.XPATH, self.issue2_category).text
    
    def get_issue3_name(self):
        return self.driver.find_element(By.XPATH, self.issue3_name).text
    
    def get_issue3_title(self):
        return self.driver.find_element(By.XPATH, self.issue3_title).text
    
    def get_issue3_status(self):
        return self.driver.find_element(By.XPATH, self.issue3_status).text
    
    def get_issue3_priority(self):
        return self.driver.find_element(By.XPATH, self.issue3_priority).text
    
    def get_issue3_category(self):
        return self.driver.find_element(By.XPATH, self.issue3_category).text
    
    def get_issue4_name(self):
        return self.driver.find_element(By.XPATH, self.issue4_name).text
    
    def get_issue4_title(self):
        return self.driver.find_element(By.XPATH, self.issue4_title).text
    
    def get_issue4_status(self):
        return self.driver.find_element(By.XPATH, self.issue4_status).text
    
    def get_issue4_priority(self):
        return self.driver.find_element(By.XPATH, self.issue4_priority).text
    
    def get_issue4_category(self):
        return self.driver.find_element(By.XPATH, self.issue4_category).text
    
    def search_issue_by_status(self, status):
        self.driver.find_element(By.XPATH, self.search_status_field).click()
        if status == "TODO":
            self.driver.find_element(By.XPATH, self.todo_selection).click()
        elif status == "IN PROGRESS":
            self.driver.find_element(By.XPATH, self.in_progress_selection).click()
        elif status == "DONE":
            self.driver.find_element(By.XPATH, self.done_selection).click()

    def search_issue_by_priority(self, priority):
        self.driver.find_element(By.XPATH, self.search_priority_field).click()
        if priority == "P1":
            self.driver.find_element(By.XPATH, self.p1_selection).click()
        elif priority == "P2":
            self.driver.find_element(By.XPATH, self.p2_selection).click()
        elif priority == "P3":
            self.driver.find_element(By.XPATH, self.p3_selection).click()
        elif priority == "P4":
            self.driver.find_element(By.XPATH, self.p4_selection).click()
        elif priority == "P5":
            self.driver.find_element(By.XPATH, self.p5_selection).click()

    def search_issue_by_category(self, category):
        self.driver.find_element(By.XPATH, self.search_category_field).click()
        if category == "Frontend":
            self.driver.find_element(By.XPATH, self.frontend_selection).click()
        elif category == "Backend":
            self.driver.find_element(By.XPATH, self.backend_selection).click()
        elif category == "Security":
            self.driver.find_element(By.XPATH, self.security_selection).click()
        elif category == "Documentation":
            self.driver.find_element(By.XPATH, self.documentation_selection).click()

    def click_search_button(self):
        self.driver.find_element(By.XPATH, self.search_button).click()

    def search_issue(self, search):
        self.driver.find_element(By.XPATH, self.search_field).clear()
        self.driver.find_element(By.XPATH, self.search_field).send_keys(search)
        

