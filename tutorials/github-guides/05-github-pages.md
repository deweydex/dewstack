# Deploying with GitHub Pages

## Learning Outcomes

After reading this guide, you will understand what GitHub Pages is and how it provides free website hosting. You will be able to enable GitHub Pages for a repository, configure it to serve your HTML and CSS files, and access your published website through a public URL. You will also understand how to update your website by pushing changes to GitHub and recognize best practices for using GitHub Pages.

## Prerequisites

You should have a GitHub account with at least one repository containing HTML and CSS files. Understanding how to make commits and work with repositories from previous guides is necessary.

## What is GitHub Pages?

GitHub Pages is a free static website hosting service provided by GitHub. It takes files from a GitHub repository and publishes them as a live website that anyone can visit on the internet. For HTML and CSS projects, GitHub Pages provides an easy way to publish websites without needing to purchase web hosting, configure servers, or manage technical infrastructure.

GitHub Pages works by serving files directly from your GitHub repository. When you enable GitHub Pages for a repository, GitHub automatically takes the HTML, CSS, and other files you've stored there and makes them accessible through a web address. Each time you update files in your repository, GitHub automatically updates the published website, so your live site always reflects your latest changes. This integration between your code storage and website hosting simplifies the process of publishing and maintaining websites.

Using GitHub Pages matters because it removes barriers to publishing websites online. Traditionally, publishing a website required finding and paying for web hosting, understanding how to upload files to servers, and managing technical details that can be intimidating for beginners. GitHub Pages eliminates these barriers by providing free hosting directly connected to where you're already storing your code, making it possible to publish websites immediately after learning HTML and CSS basics.

GitHub Pages is particularly well-suited for static websites built with HTML, CSS, and JavaScript. Static websites are those that don't require server-side processing or databases - they're just files that browsers download and display. For learning web development, this covers the vast majority of projects you'll create. Portfolio sites, documentation, project showcases, and simple interactive websites all work perfectly with GitHub Pages.

The free nature of GitHub Pages makes it accessible for students, learners, and anyone building personal or small project websites. There are no usage limits for reasonable personal use, and the service includes HTTPS encryption automatically, ensuring your websites load securely. This combination of ease, integration with GitHub, and zero cost makes GitHub Pages an ideal solution for publishing the websites you build while learning web development.

## Understanding GitHub Pages URLs

GitHub Pages provides each published website with a unique URL where visitors can access it. Understanding how these URLs work helps you share your websites and understand the relationship between your repository and your published site.

For repositories in personal accounts, GitHub Pages URLs follow a specific pattern: username.github.io/repository-name. For example, if your GitHub username is "johndoe" and your repository is called "my-website", your GitHub Pages URL would be "johndoe.github.io/my-website". This URL structure makes it easy to predict your website address based on your repository name.

There's also a special repository format where if you create a repository named exactly "username.github.io" (replacing "username" with your actual GitHub username), GitHub Pages serves it from the root domain without the repository name. So "johndoe.github.io" repository would be accessible at just "johndoe.github.io" rather than "johndoe.github.io/johndoe.github.io". This format is useful if you want a shorter URL or plan to use a custom domain name later.

GitHub automatically provides HTTPS encryption for all GitHub Pages sites, so your URLs will use "https://" rather than "http://". This secure connection protects visitors and is required for many modern web features. The HTTPS is automatic and requires no configuration on your part.

After enabling GitHub Pages, GitHub displays your website URL in the repository settings, making it easy to copy and share. You can bookmark this URL, share it with others, or use it to access your published website from any device. The URL remains active as long as your repository exists and GitHub Pages remains enabled.

## Enabling GitHub Pages

Enabling GitHub Pages for a repository is a straightforward process completed through the repository's settings. Once enabled, GitHub automatically publishes your website and provides you with the URL where it's accessible.

Navigate to your repository on GitHub and click the "Settings" tab, which appears in the row of tabs near the top of the repository page. In the left sidebar of the Settings page, find and click "Pages" in the menu. This takes you to the GitHub Pages configuration section where you can enable and configure the service.

The Pages settings section shows several options. The most important is selecting which branch GitHub should use as the source for your website. For simple projects, you'll typically choose your main branch, which contains your HTML and CSS files. GitHub also asks whether to serve files from the root of the branch or from a specific folder like "/docs". For standard HTML and CSS projects where your index.html file is in the repository root, choose the root directory option.

After selecting your source branch and directory, click "Save" to enable GitHub Pages. GitHub processes your repository and sets up the website hosting. This process typically takes a minute or two. Once complete, GitHub displays a message indicating that your site is published, along with the URL where it's accessible. GitHub also sends an email notification when your site is ready.

It's important to understand that GitHub Pages looks for an index.html file to serve as the homepage. If your main HTML file has a different name, you'll need to either rename it to index.html or configure GitHub Pages to serve a specific file. The standard convention of naming your main page "index.html" ensures it's automatically served when someone visits your site's root URL.

After enabling GitHub Pages, any changes you make to files in your repository and commit to the selected branch will automatically appear on your published website within a few minutes. There's no separate publishing step - the live site stays in sync with your repository, making it easy to update your website by simply committing changes to GitHub.

## Updating Your Published Website

One of GitHub Pages' greatest advantages is how easily you can update your published website. Because your live site automatically syncs with your repository, updating your website requires only committing changes to GitHub.

When you want to update your website, edit your HTML, CSS, or other files either through GitHub's web interface or by working locally and pushing changes. Make your modifications, write a commit message describing what changed, and commit the changes to your repository's main branch (or whichever branch you've configured for GitHub Pages).

After committing, GitHub automatically detects the changes and rebuilds your website. This process typically takes one to two minutes. You can see the build status in your repository's Pages settings or in the Actions tab if you want to monitor the deployment process. Once GitHub finishes rebuilding, your changes appear on your live website automatically.

This automatic deployment means you don't need to manually upload files, configure servers, or perform separate publishing steps. Your development workflow becomes simply: make changes, commit to GitHub, and your website updates. This simplicity allows you to iterate quickly, test changes, and keep your published site current with minimal effort.

If you need to revert changes, you can view your repository's commit history, find a previous commit before the unwanted changes, and revert to that commit. GitHub Pages will rebuild using the earlier version, effectively undoing recent changes. This ability to roll back provides safety when experimenting with your website, knowing you can always return to a previous working version.

## Best Practices for GitHub Pages

Following best practices when using GitHub Pages ensures your websites load quickly, display correctly, and provide good experiences for visitors. These practices also help you maintain your sites efficiently as they grow.

Always use relative paths when linking to CSS files, images, and other resources. Relative paths specify file locations relative to the current file, such as "styles.css" for a file in the same folder or "images/photo.jpg" for a file in a subfolder. Absolute paths that reference your local computer won't work when files are served through GitHub Pages. Relative paths ensure your links work correctly regardless of where the website is hosted.

Keep your repository organized with a clear file structure. Place HTML files in logical locations, organize CSS files clearly, and group related assets like images into folders. A well-organized repository makes it easier to maintain your website and helps if you later move to different hosting. Good organization also makes your code more professional and easier for others to understand if you share your repositories.

Test your website locally before committing changes. Open your HTML files in a web browser on your computer to verify everything works before pushing to GitHub. This catches issues early and ensures your GitHub Pages site displays correctly when published. Local testing is faster than waiting for GitHub Pages to rebuild after each change.

Write clear commit messages when updating your website. Since GitHub Pages automatically publishes commits, clear messages help you track what changed and when. If you need to revert changes or understand your site's evolution, good commit messages make the history meaningful and useful.

Consider the public nature of GitHub Pages sites. If your repository is public, your website is accessible to anyone on the internet. This is typically desirable for portfolios and project showcases, but be mindful of any personal information or content you include. If you need a private website, you can make your repository private, though free GitHub accounts have limitations on private repository Pages.

GitHub Pages works well for static sites but has limitations. It doesn't support server-side processing, databases, or backend functionality. For HTML and CSS websites, this isn't a limitation, but it's important to understand that GitHub Pages is designed for static content. As you learn more advanced web development, you might need different hosting for dynamic features, but GitHub Pages remains excellent for the vast majority of front-end web projects.

## Next Steps

Congratulations on learning how to publish websites with GitHub Pages! You now have a complete workflow for creating, storing, and publishing websites. Continue building projects, experimenting with designs, and publishing your work. Each project you publish helps you refine your skills and build a portfolio of your work.

## Bibliography

GitHub. "Getting Started with GitHub Pages." GitHub Guides. https://guides.github.com/features/pages/

GitHub. "GitHub Pages Documentation." GitHub Docs. https://docs.github.com/en/pages

Mozilla Developer Network. "Deploying Websites." MDN Web Docs. https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/Publishing_your_website

The Odin Project. "Introduction to HTML and CSS." The Odin Project Curriculum. https://www.theodinproject.com/paths/foundations/courses/foundations

