<br/>
<div align="center">
<a href="https://github.com/MUSTAFA-Hamzawy/BugWhiz">
<img src="images/logo.png" alt="Logo" width="250" height="200">
</a>
<h1 align="center">BugWhiz</h1>
<p align="center">
An Automated Bug Triaging System aims to streamline the process of handling bug reports in software development. It makes use of AI and machine learning to analyze bug reports, identify duplicates, assign them to the right developers, and prioritize them based on their criticality.
<br/>
<br/>
<a href="https://drive.google.com/file/d/1pxL8Yt2HJNUQvWWIRSxTZZZNAAWxu3SN/view?usp=drive_link" target="_blank">View Demo .</a>  
<a href="https://github.com/MUSTAFA-Hamzawy/BugWhiz/issues/new?labels=bug&amp;template=bug_report.md" target="_blank">Report Bug .</a>
<a href="https://github.com/MUSTAFA-Hamzawy/BugWhiz/issues/new?labels=enhancement&amp;&template=feature_request.md" target="_blank">Request Feature</a>
</p>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributing](#contributing)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)

## About The Project

The Automated Bug Triaging System, BugWhiz, is designed to streamline and enhance the efficiency of handling and prioritizing bug reports in software development by integrating advanced AI and machine learning techniques. Traditional methods of bug triaging are often prone to human error and result in delays that can affect the overall software development lifecycle. BugWhiz aims to address these challenges by automating the critical aspects of bug triaging, ensuring a more efficient and accurate process.

In software development, managing bug reports effectively is crucial for maintaining software quality and user satisfaction. However, the current manual process for handling bug reports is often inefficient and error-prone, leading to several issues. Development teams often receive a large number of bug reports, making it challenging to sort, categorize, and prioritize them manually. Manual categorization of bug reports can be inconsistent, as different team members may interpret and categorize issues differently. Determining the priority of each bug based on severity, user impact, and business priorities is time-consuming and may not always be accurate. Assigning bugs to the most suitable developers manually can be inefficient, as it may not consider the developer's expertise. Identifying and merging duplicate bug reports manually is challenging, resulting in multiple developers working on the same issue, and wasting time. Developers may forget or overlook assigned bugs due to a lack of reminders, causing delays in bug resolution and impacting software quality.

The primary objectives of BugWhiz are to automate the categorization of bug reports using Natural Language Processing (NLP) to ensure consistent and accurate categorization, prioritize bugs based on severity, user impact, and business priorities, and assign bugs to the most suitable developers based on historical data and expertise. Additionally, BugWhiz aims to detect duplicate bug reports to prevent redundant efforts, send automated notifications to relevant stakeholders about the status of bug reports, and provide regular reminders to developers about their assigned tasks, enabling continuous improvement in the development process. Simplifying the bug reporting process for users ensures detailed and structured bug information for developers.

BugWhiz automates the process of handling and prioritizing bug reports by leveraging AI and machine learning. It automatically categorizes bug reports using NLP, ensuring consistent and accurate categorization. The system prioritizes bugs based on severity, user impact, and business priorities, ensuring critical issues are addressed promptly. It assigns bugs to the most suitable developers based on historical data and expertise, optimizing resolution times. BugWhiz also detects and merges duplicate bug reports, preventing redundant work and saving resources. The system sends automated notifications to relevant stakeholders about the status of bug reports, ensuring timely communication. It provides regular reminders to developers about their assigned tasks, reducing delays in bug resolution.


### Built With

This project was built with the following technologies:

- Node.JS
- React.JS
- Express.JS
- MongoDB
- Python

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

1- Please ensure that you have Node.js , mongoDB server, and npm are installed on your machine.

2- Install python requirements
  ```sh
  pip install joblib
  pip install sklearn
  pip install pandas
  pip install joblib
  ```

### Installation

Please follow the following steps for successful installation:

1. **Clone the Repository:** Get started by cloning the repository to your local machine.

   ```
   git clone https://github.com/MUSTAFA-Hamzawy/BugWhiz.git
   ```

2. **Install Frontend Packages:** Navigate to the &quot;/Frontend&quot; directory and install the required yarn packages by executing the following command in your terminal:

   ```sh
   npm install
   ```

3. **Install Backend Packages:** Similarly, navigate to the &quot;/Backend&quot; directory and install the required yarn packages by executing the following command in your terminal:

   ```sh
   npm install
   ```

4. **Set Up Environment:**

   - In the &quot;/Backend&quot; directory, copy the content of &quot;.env.example&quot; file and create a new file named &quot;.env&quot;. Adjust the environment variables according to your requirements or you can leave them as it is.

   - In the &quot;/Frontend&quot; directory, copy the content of &quot;.env.example&quot; file and create a new file named &quot;.env&quot;. Adjust the environment variables according to your requirements or you can leave them as it is.

5. **Run the Backend:** Navigate to &quot;/Backend&quot; directory and type the following command in your terminal to run your backend server:

   ```sh
   npm start
   ```

6. **Run the Frontend:** Finally, navigate to &quot;/Frontend&quot; directory and type the following command in your terminal to run your frontend server:

   ```sh
   npm start
   ```

   Now, your application should be successfully up and running!

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag &quot;enhancement&quot;.
Don&#39;t forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m &#39;Add some AmazingFeature&#39;`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## API Documentation

<a href="https://documenter.getpostman.com/view/17672386/2sA2rDxfzx" target="_blank">Click here to explore API Docs.</a>

## Contributors

<table>
  <tr>
    <td align="center">
    <a href="https://github.com/MUSTAFA-Hamzawy" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/72188665?v=4" width="150px;" alt="Mustafa Hamzawy"/>
    <br />
    <sub><b>Mustafa Hamzawy</b></sub></a>
    </td>
    <td align="center">
    <a href="https://github.com/karimmahmoud22" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/82693464?v=4" width="150px;" alt="Karim Mahmoud"/>
    <br />
    <sub><b>Karim Mahmoud</b></sub></a>
    </td>
        </td>
    <td align="center">
    <a href="https://github.com/DoniaGameel" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/95960340?v=4" width="150px;" alt="Donia Gameel"/>
    <br />
    <sub><b>Donia Gameel</b></sub></a>
    </td>
        </td>
    <td align="center">
    <a href="https://github.com/Karim-Mohamed20" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/101477261?v=4" width="150px;" alt="Karim Muhammed"/>
    <br />
    <sub><b>Karim Muhammed</b></sub></a>
    </td>
  </tr>
 </table>
