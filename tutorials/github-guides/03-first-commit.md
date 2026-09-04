# Making Your First Commit

## Learning Outcomes

After reading this guide, you will understand what commits are and how they create a permanent record of changes to your repository. You will be able to make commits through GitHub's web interface, write meaningful commit messages, and understand how commit history tracks your project's evolution. You will also recognize the importance of commits in version control and how they enable you to track and revert changes.

## Prerequisites

You should have a GitHub account and at least one repository with files in it from the previous guide. Understanding the basic GitHub interface and repository structure is necessary before learning about commits.

## Understanding Commits

A commit is a snapshot of your project at a specific point in time. When you make changes to files in your repository and save those changes, you create a commit that permanently records what changed, when it changed, and includes a message describing why the change was made. Commits are the building blocks of version control, allowing you to track your project's evolution and return to previous versions if needed.

Commits work like save points in a video game or document versions. Each time you make meaningful progress or complete a task, you create a commit that saves the current state of your files. If you make a mistake later or want to see how your project looked at an earlier point, you can view or return to any previous commit. This differs from regular file saving because commits include a description of what changed and create a permanent historical record that can't be accidentally overwritten. Each commit has a unique identifier and is permanently stored in your repository's history.

Commit messages are descriptions you write to explain what changed and why. Good commit messages help you and others understand the project's history at a glance. When you view a repository's commit history, you see a list of messages that tell the story of how the project developed. Clear messages make it easy to find specific changes, understand the reasoning behind modifications, and see the progression of features. Without good commit messages, your project history becomes a list of mysterious changes that are difficult to understand later.

Effective commit messages follow a few guidelines. They should be written in the present tense, describing what the commit does rather than what you did. For example, "Add responsive navigation styles" is better than "Added responsive navigation styles" or "I added responsive navigation styles". The message should be concise but descriptive - ideally one line that summarizes the change, with optional additional lines providing more detail. For simple changes like fixing typos or updating styles, a short message is sufficient. For larger changes or new features, a longer message explaining the context and reasoning is helpful.

Common commit message patterns include starting with action words like "Add", "Fix", "Update", "Remove", or "Refactor". "Add" indicates new features or files, "Fix" indicates bug fixes, "Update" indicates modifications to existing features, "Remove" indicates deletions, and "Refactor" indicates code improvements that don't change functionality. Following these patterns makes commit histories more readable and professional, helping you quickly scan through your project's evolution.

## Making Commits Through the Web Interface

You can make commits to your GitHub repository directly through the web interface without installing any additional software. This approach is perfect for beginners and works well for HTML and CSS projects where you're making changes through the browser.

To edit a file and commit changes, navigate to your repository and click on the file you want to modify. You'll see a pencil icon in the top right of the file view. Clicking this icon opens the file in GitHub's built-in editor, which provides a text editing interface similar to a basic code editor. Make your changes to the file - you can modify HTML, CSS, or any text-based content directly in this interface. The editor includes basic features like syntax highlighting that makes code easier to read and edit.

After making changes, scroll down to the "Commit changes" section at the bottom of the page. Here you'll see two fields: a commit message field and an optional extended description field. The commit message field is required and should contain a brief description of your changes. For example, if you updated the color scheme of your website, you might write "Update color scheme to use blue palette" in the commit message field. The extended description field allows you to provide additional context if needed, such as explaining why you made the change or what specific aspects were modified.

GitHub offers two options for how to commit: you can commit directly to the main branch, or you can create a new branch for the commit and start a pull request. For simple projects where you're working alone, committing directly to the main branch is fine. For learning purposes or when you want to review changes before they go live, creating a branch and pull request provides a safer workflow that we'll cover in later guides. The default option of committing directly to main works well for straightforward updates and learning projects.

Once you've written your commit message and chosen where to commit, click the green "Commit changes" button. GitHub saves your changes and creates a new commit in your repository's history. You can see this commit in the repository's commit history, which is accessible from the repository's main page by clicking on the number of commits or viewing the history. The commit includes your message, the exact changes made, and a timestamp showing when the commit was created.

This web-based workflow is accessible and straightforward, making it ideal for beginners. As you become more comfortable with GitHub, you might choose to use desktop applications or command-line tools that provide more advanced features, but the web interface remains a powerful and convenient way to manage your repositories for many development tasks.

## Viewing Commit History

Understanding how to view commit history helps you track your project's development and understand what changed over time. Each repository includes a complete history of all commits, showing who made changes, when they were made, and what specifically changed.

To view commit history, navigate to your repository and look for a link or button showing the number of commits, typically near the top of the repository page. Clicking this opens the commit history view, which shows a list of all commits in reverse chronological order, with the most recent commits appearing first. Each commit entry shows the commit message, the author, the date and time, and a link to view the specific changes made in that commit.

Clicking on a commit message or the commit identifier opens a detailed view showing exactly what files were changed and what specific modifications were made. This view uses a diff format that highlights additions in green and deletions in red, making it easy to see what changed. For each file, you can see the exact lines that were added, removed, or modified. This detailed view is invaluable for understanding how your project evolved and for reviewing changes before they're incorporated into your main project.

The commit history serves as documentation of your project's development. It shows the progression of features, fixes, and improvements over time. This history is permanent and can't be deleted easily, which means you can always return to understand what changed and when. For learning purposes, viewing your commit history helps you see your progress and understand how small changes accumulate into a complete project.

## Best Practices for Commits

Following best practices when making commits creates a clear, useful project history that helps you understand your work and makes collaboration easier if you work with others in the future.

Make commits regularly as you complete logical units of work. Rather than making one massive commit at the end of a work session, commit smaller changes as you complete features or fix issues. This creates a more detailed history and makes it easier to identify and revert specific changes if needed. For example, if you update the header styles and then add a new section, make two separate commits - one for the header updates and one for the new section. This granular history is more useful than a single commit containing multiple unrelated changes.

Write clear, descriptive commit messages that explain what changed and why. Avoid vague messages like "updates" or "fixes" that don't provide useful information. Instead, write messages like "Update navigation to use flexbox layout" or "Fix color contrast issue in footer". If a change requires explanation, use the extended description field to provide context. Good commit messages make your project history readable and professional.

Keep commits focused on single concerns when possible. If you're updating multiple unrelated files, consider whether they should be separate commits. For example, fixing a typo in one file and updating styles in another file are two different concerns that could be two separate commits. This practice makes it easier to revert specific changes without affecting unrelated modifications.

Review your changes before committing. GitHub shows you a preview of what will change before you commit. Take a moment to verify that your changes are correct and that you're not accidentally committing unintended modifications. This review step helps catch mistakes before they become part of your project history.

## Next Steps

Now that you understand how to make commits, you're ready to learn about branches and pull requests. The next guide, "Branches and Pull Requests," explains how to work on different versions of your project and manage changes before they become part of your main branch.

## Bibliography

GitHub. "Making and reviewing changes." GitHub Docs. https://docs.github.com/en/pull-requests/committing-changes-to-your-project

Pro Git Book. "Git Basics - Recording Changes to the Repository." Pro Git. https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository

Atlassian. "Git Commit." Atlassian Git Tutorials. https://www.atlassian.com/git/tutorials/saving-changes

The Odin Project. "Git Basics." The Odin Project Curriculum. https://www.theodinproject.com/paths/foundations/courses/foundations

