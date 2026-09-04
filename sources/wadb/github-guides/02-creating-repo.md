# Creating Your First Repository

## Learning Outcomes

After completing this guide, you will understand what a repository is and how it functions as a storage location for your projects. You will be able to create a new repository on GitHub through the web interface, configure its basic settings, and understand the options available when creating repositories. You will also know how to upload files to your repository and verify they're stored correctly.

## Prerequisites

You should have created a GitHub account from the previous guide. You should also have at least one HTML or CSS file that you want to store in your repository, though you can create an empty repository and add files later if needed.

## Understanding Repositories

A repository, often shortened to "repo," is a storage location for a project on GitHub. Each repository contains all the files for one project, along with the complete history of changes made to those files over time. Understanding what repositories are and how they work is essential for using GitHub effectively.

Repositories can be either public or private. Public repositories are visible to anyone on the internet who has the repository URL. Anyone can view your code, download your files, and see your commit history. For learning and portfolio projects, public repositories are common because they allow you to share your work, demonstrate your skills, and receive feedback from others. Private repositories are only visible to you and people you specifically invite as collaborators. Private repositories are useful for projects you're not ready to share, assignments you're working on, or projects that contain sensitive information. GitHub provides free private repositories, so you can choose the privacy level that makes sense for each project.

Each repository has its own URL on GitHub, following the pattern github.com/username/repository-name. This URL serves as both the web address where you can view the repository online and the remote location where your code is stored in the cloud. For example, if your GitHub username is "johndoe" and your repository is called "my-first-website", your repository URL would be "github.com/johndoe/my-first-website". This URL structure makes it easy to predict your repository address and share it with others.

Repositories track the complete history of your project. Every time you save changes to GitHub, Git creates a snapshot called a commit. Each commit records what changed, when it changed, and who made the change. This history allows you to see how your project evolved, revert to previous versions if something goes wrong, and understand what each change accomplished. For beginners, this history is valuable for learning from your progress and recovering from mistakes. You can view the commit history at any time to see how your project developed over time.

Repositories also include a README file option, which is a markdown document that describes the project. The README appears on the repository's main page and helps visitors understand what the project does, how to use it, and how to contribute. While optional, adding a README to your repositories is good practice because it helps others understand your work and serves as documentation for your future self. Even for simple projects, a brief README explaining what the project is and what technologies it uses helps establish professionalism and clarity.

## Creating a Repository

Creating a repository on GitHub is a simple process completed through the GitHub web interface. The process involves a few configuration choices that determine how your repository behaves and appears to others.

After logging into your GitHub account, look for a plus icon in the top right corner of the page. This icon appears near your profile picture and notifications. Clicking this icon opens a dropdown menu with several options including "New repository", "Import repository", and "New codespace". Select "New repository" from this menu. This action takes you to the repository creation page where you'll configure your new repository.

On the repository creation page, you'll see a form asking for several pieces of information. The first and most important field is the repository name. Choose a name that clearly describes your project. Good repository names are short, descriptive, and use lowercase letters with hyphens instead of spaces. For example, "my-first-website" or "portfolio-site" are better choices than "My Website" or "project1". The repository name becomes part of the URL, so it should be web-friendly. GitHub will check if the name is available - if someone else has already used your chosen name within your account scope, you can still use it, but if it's taken globally by another user, you'll need to pick a different one.

The next section asks for a description, which is optional but helpful. A good description briefly explains what the project is, such as "My first HTML and CSS website project" or "A responsive portfolio site built with HTML and CSS". This description appears on your repository's main page, in search results, and when others browse your repositories. While you can skip this field, adding a description helps others understand your project at a glance and makes your repositories more professional and discoverable.

You'll see options for making the repository public or private. For learning projects and portfolios, public repositories are typically preferred because they allow you to share your work, demonstrate your skills, and potentially receive feedback from the community. Public repositories also enable GitHub Pages hosting, which allows you to publish your websites for free. Private repositories are free on GitHub and useful if you want to keep a project private while you're working on it, then make it public later when it's ready. You can change the privacy setting at any time after creating the repository, so you're not locked into your initial choice.

GitHub offers to initialize the repository with a README file, a .gitignore file, and a license. For your first repository, checking the box to add a README is helpful because it gives you a file you can edit to describe your project. The README will appear on your repository's main page and serves as documentation. The .gitignore file helps exclude files you don't want to track in version control, which is more relevant for projects that build or compile code. For simple HTML and CSS projects, you typically won't need a .gitignore file initially, though you can add one later if needed. The license option allows you to specify how others can use your code. For learning projects, this is optional, but choosing a license becomes important if you want others to use or contribute to your code. If you're unsure, you can skip the license for now and add one later.

After filling in the repository name, optionally adding a description, choosing public or private, and deciding whether to initialize with a README, click the green "Create repository" button at the bottom of the page. GitHub will create your repository and display a page with instructions for getting started. This page shows different options depending on whether you're creating a new project or adding an existing project to GitHub. Since you likely have HTML and CSS files already created on your computer, you'll want to follow the instructions for adding files to your repository.

## Adding Files to Your Repository

Once your repository is created, you need to add your HTML and CSS files to it. GitHub provides several methods for adding files, and the web interface method is simplest for beginners.

If you didn't initialize your repository with a README, GitHub will show you instructions for creating your first file or uploading existing files. Look for links or buttons that say "uploading an existing file" or "Add file". Clicking these options takes you to GitHub's file upload interface.

The upload interface allows you to drag and drop files directly from your computer into the browser, or click to browse and select files. You can upload multiple files at once by selecting them all. After selecting your files, GitHub shows them in a list with options to rename or remove them before committing. You can also create new files directly in the interface by clicking "Add file" and choosing "Create new file", then typing or pasting your code.

After uploading or creating your files, scroll down to the "Commit changes" section at the bottom of the page. Here you'll see a field for a commit message. Write a descriptive message explaining what you're adding, such as "Add initial HTML and CSS files" or "Upload first website project". Commit messages help you track what changed and when, so clear messages are valuable even for your first commit.

Once you've written your commit message, click the green "Commit changes" button. GitHub saves your files and creates the first commit in your repository's history. After the commit completes, you'll see your files listed in the repository. You can click on any file to view its contents, and GitHub will display it with syntax highlighting that makes code easier to read.

## Verifying Your Repository

After uploading files, verify that everything is stored correctly. Navigate to your repository's main page by clicking the repository name or using the breadcrumb navigation at the top. You should see all your files listed in the file browser interface. Click on files to view their contents and confirm they display correctly.

Check that file paths are correct, especially if your HTML files link to CSS files or images. Relative paths should work correctly since the file structure in your repository matches how files will be served. If you have an index.html file, GitHub will automatically recognize it as the main page when viewing your repository, though this doesn't automatically publish it as a website - that requires enabling GitHub Pages, which is covered in a later guide.

Your repository now serves as both backup storage and a way to share your project with others. The repository URL can be shared with anyone, allowing them to view your code and download your files. Each time you make changes and commit them, those changes are permanently recorded in your repository's history, creating a complete record of your project's development.

## Next Steps

With your repository created and files uploaded, you're ready to learn about making commits and managing changes. The next guide, "Making Your First Commit," explains how to save changes to your repository and write effective commit messages that document your project's evolution.

## Bibliography

GitHub. "Creating a new repository." GitHub Docs. https://docs.github.com/en/get-started/quickstart/create-a-repo

GitHub. "Adding a file to a repository." GitHub Docs. https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

Pro Git Book. "Git Basics - Getting a Git Repository." Pro Git. https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository

The Odin Project. "Introduction to Git." The Odin Project Curriculum. https://www.theodinproject.com/paths/foundations/courses/foundations

