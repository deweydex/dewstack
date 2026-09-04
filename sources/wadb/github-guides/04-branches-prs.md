# Branches and Pull Requests

## Learning Outcomes

After reading this guide, you will understand what branches are and how they allow you to work on different versions of your project simultaneously. You will be able to create branches, make changes on branches, and understand what pull requests are and how to use them. You will also recognize how branches and pull requests enable safe experimentation and organized collaboration workflows.

## Prerequisites

You should understand how to make commits from the previous guide. Familiarity with the basic GitHub interface and repository structure is also necessary.

## Understanding Branches

Branches in Git and GitHub allow you to work on different versions of your project simultaneously without affecting the main version. Think of branches like alternate timelines - you can experiment with new features, try different approaches, or work on multiple tasks in parallel, all while keeping your main branch stable and functional.

The main branch, typically called "main" or "master," represents the primary, stable version of your project. This is the version that's ready to share, deploy, or use. When you first create a repository, it starts with just the main branch. As your project grows, you might want to experiment with new features or redesigns without risking your stable main version. Branches let you create copies of your project where you can make changes safely.

When you create a new branch, you're creating an independent line of development that starts from the current state of your main branch. Changes you make on this new branch don't affect the main branch until you decide to merge them together. This means you can try out ideas, experiment with designs, or work on features without worrying about breaking your working website. If an experiment doesn't work out, you can simply delete the branch without affecting your main project.

Branches are especially useful when working on larger changes or multiple features simultaneously. For example, you might create a branch called "redesign-header" to work on updating your website's header, and another branch called "add-contact-form" to work on a new contact page. Both branches start from the same point but develop independently. When each feature is complete and tested, you can merge the branch back into main, incorporating the changes into your primary project.

Naming branches clearly helps you remember what each branch is for. Good branch names are descriptive and use hyphens instead of spaces, such as "fix-navigation-bug" or "add-responsive-images". Some teams use naming conventions like starting with feature/, fix/, or experiment/ to categorize branches, but for personal projects, clear descriptive names are sufficient. The important thing is that the name tells you what work happens on that branch.

Understanding branches becomes increasingly valuable as projects grow. Even for simple websites, branches provide a safe way to experiment with design changes or try new features. The ability to work on changes independently, test them thoroughly, and then merge them only when ready creates a professional workflow that scales from personal projects to large team collaborations.

## Creating and Using Branches

Creating a branch on GitHub is straightforward through the web interface. You can create branches to experiment with changes, work on new features, or try different approaches to your design without affecting your main branch.

To create a new branch, navigate to your repository and look near the top left where you'll see a dropdown or button showing your current branch name, typically "main". Clicking this opens a branch selector interface. You'll see an option to create a new branch, or you can type a new branch name in a search field. When you type a branch name that doesn't exist, GitHub offers to create it for you. Enter a descriptive name for your branch and confirm the creation.

After creating or switching to a branch, you'll see that branch name displayed where the branch selector was. Any commits you make now will go to this branch instead of main. The branch starts as an exact copy of main at the point you created it, so all your existing files and their current state are present. You can now make changes, edit files, and create commits on this branch without affecting main.

When working on a branch, the workflow is the same as working on main - you edit files, write commit messages, and save changes. The difference is that these changes exist only on your branch until you merge them. You can view your branch's commit history separately from main, seeing exactly what changes you've made. This isolation lets you experiment freely, knowing your main branch remains unchanged.

When you're ready to incorporate your branch's changes into main, you merge the branch. Merging combines the changes from your branch into main, bringing those commits and file modifications into the main branch. GitHub provides a simple interface for merging through pull requests, which we'll discuss next. After merging, your branch's changes become part of main, and you can continue working from there or create new branches for future features.

## Understanding Pull Requests

Pull requests, often abbreviated as PRs, are proposals to merge changes from one branch into another. While the name might suggest requesting someone else to pull your changes, pull requests are valuable even when working alone because they provide a structured way to review, discuss, and merge changes before they become part of your main branch.

When you create a pull request, you're proposing that changes from a branch should be merged into another branch, typically from a feature branch into main. The pull request shows exactly what would change - which files would be modified, added, or deleted, and what the specific changes are. This preview allows you to review changes before they're merged, ensuring everything looks correct and works as intended.

Pull requests include several important components. The title should clearly describe what the pull request does, similar to a good commit message. The description field allows you to explain the changes in detail, why you made them, and any relevant context. GitHub automatically shows a diff - a side-by-side comparison - of all files that would change, highlighting exactly what's being added, removed, or modified. This visual representation makes it easy to review changes before merging.

When working alone, pull requests serve as a review checkpoint. Before merging changes into main, you can review the pull request to ensure everything is correct, test any changes if possible, and write notes about what was changed and why. This practice creates good habits for collaboration and helps catch mistakes before they become part of your main branch. The pull request also creates a record of why changes were made, which is valuable when looking back at project history.

In collaborative projects, pull requests become essential communication tools. Team members can review proposed changes, leave comments asking questions or suggesting improvements, and discuss the implementation before merging. The pull request author can make additional commits to address feedback, and all of this discussion is preserved in the project history. Even for solo projects, using pull requests prepares you for professional workflows and creates better organized project histories.

## Creating and Merging Pull Requests

Creating a pull request involves a few simple steps that lead to reviewing and merging your changes. This process ensures changes are reviewed before becoming part of your main branch.

After you've made commits on a branch and want to merge those changes into main, navigate to the "Pull requests" tab in your repository. Click "New pull request" to begin creating one. GitHub will ask you to select which branches to compare - choose your feature branch as the source and "main" as the destination. GitHub shows you a preview of what would change if you merge the pull request, displaying the diff of all modified files.

Write a clear title for your pull request that summarizes the changes. For example, "Update website color scheme to green palette" is better than "Changes" or "Updates". In the description field, explain what changed and why. For example, "This PR updates the color scheme from blue to green to better match the project's theme. Also includes font size adjustments to improve readability with the new colors." This description helps you remember the reasoning later and serves as documentation for your project history.

Review the changes GitHub shows in the diff view. Make sure all modifications look correct and that nothing unintended was changed. The diff highlights additions in green and deletions in red, making it easy to see what's changing. If you notice something that needs adjustment, you can make additional commits to your branch, and they'll automatically appear in the pull request. This iterative process allows you to refine changes before merging.

When you're satisfied with the changes and ready to merge, click the "Merge pull request" button. GitHub merges your branch into main, incorporating all your commits and changes. After merging, you can delete the feature branch since its changes are now in main. Your main branch now contains your updated code, and the pull request serves as a permanent record of what changed and why.

This workflow - create branch, make changes, create pull request, review, merge - might seem like extra steps for simple changes. However, it creates organized, reviewable changes and establishes habits that scale well as projects grow. Even for solo projects, this process helps catch mistakes and creates clearer project history.

## Best Practices

Following best practices when using branches and pull requests creates better organized projects and prepares you for professional workflows.

Keep branches focused on single features or concerns. If you find yourself working on multiple unrelated changes on one branch, consider splitting them into separate branches. This makes pull requests easier to review and understand. For example, if you're updating styles and adding new content, those could be two separate branches and pull requests, making it clear what each change accomplishes.

Write descriptive branch names that clearly indicate what work happens on that branch. Names like "fix-navigation-bug" or "add-contact-form" are immediately understandable, while names like "changes" or "branch1" provide no useful information. Good naming helps you navigate your branches and understand your project's structure.

Create pull requests even for your own work. The review process helps catch mistakes and creates a clear record of what changed. Write detailed descriptions explaining not just what changed, but why you made those changes. This documentation becomes valuable when looking back at your project history.

Review your own pull requests before merging. Take time to look at the diff, verify changes are correct, and ensure everything works as intended. This self-review process helps you develop attention to detail and catch issues before they become part of your main branch.

## Next Steps

Now that you understand branches and pull requests, you're ready to learn about publishing your websites. The next guide, "Deploying with GitHub Pages," explains how to publish your HTML and CSS websites for free using GitHub Pages hosting.

## Bibliography

GitHub. "About pull requests." GitHub Docs. https://docs.github.com/en/pull-requests/collaborating-with-pull-requests

GitHub. "About branches." GitHub Docs. https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches

Pro Git Book. "Git Branching." Pro Git. https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell

Atlassian. "Git Branching Tutorial." Atlassian Git Tutorials. https://www.atlassian.com/git/tutorials/using-branches

