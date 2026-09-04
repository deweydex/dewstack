# 🚀 GitHub Pages Deployment Guide

Host your HTML/CSS/SQL tutorial online for free using GitHub Pages. Your students can access it from anywhere with just a link!

## ⏱️ Time Required
- **First time:** 10-15 minutes
- **Updates:** 2-3 minutes

## 📋 Prerequisites

- A GitHub account (free) - [Sign up here](https://github.com/signup)
- Your tutorial files (index.html, styles.css, tutorial.js, teacher.html)
- A web browser

**No coding or terminal experience required!**

---

## 🎯 Method 1: GitHub Web Interface (Easiest)

Perfect for teachers with no coding experience. Everything is done through your web browser!

### Step 1: Create a GitHub Account

1. Go to [github.com/signup](https://github.com/signup)
2. Enter your email address
3. Create a password
4. Choose a username (e.g., `ms-smith-teacher`)
5. Verify your email
6. ✅ You now have a GitHub account!

### Step 2: Create a New Repository

1. **Log in** to GitHub
2. Click the **"+"** icon (top right corner)
3. Click **"New repository"**
4. Fill in the details:
   - **Repository name:** `sql-tutorial` (or any name you like)
   - **Description:** "Interactive HTML, CSS, and SQL tutorial for students"
   - **Visibility:** Choose **Public** ✅
   - **Initialize:** Check ✅ **"Add a README file"**
5. Click **"Create repository"**

✅ **Your repository is created!**

### Step 3: Upload Your Files

1. In your new repository, click **"Add file"** → **"Upload files"**
2. **Drag and drop** these 4 files (or click "choose your files"):
   - `index.html`
   - `styles.css`
   - `tutorial.js`
   - `teacher.html`
3. In the "Commit changes" box at the bottom:
   - Type: "Add tutorial files"
4. Click **"Commit changes"**

✅ **Your files are uploaded!**

### Step 4: Enable GitHub Pages

1. In your repository, click **"Settings"** (top menu bar)
2. In the left sidebar, scroll down and click **"Pages"**
3. Under **"Source"**:
   - **Branch:** Select `main` from the dropdown
   - **Folder:** Leave as `/ (root)`
4. Click **"Save"**
5. Wait 2-5 minutes for deployment

✅ **Your site is being published!**

### Step 5: Get Your Website Link

1. Still in **Settings → Pages**
2. At the top, you'll see a blue box that says:
   > "Your site is live at https://YOUR-USERNAME.github.io/sql-tutorial/"
3. **Copy this URL** - this is your tutorial website!

✅ **Your tutorial is now online!**

---

## 🔗 Sharing Your Tutorial

### **Student Link** (Share this with your class):
```
https://YOUR-USERNAME.github.io/sql-tutorial/
```

### **Teacher Link** (Keep this private for yourself):
```
https://YOUR-USERNAME.github.io/sql-tutorial/teacher.html
```

### **Ways to Share:**
- Post link in your Learning Management System (Canvas, Blackboard, Google Classroom)
- Email to students
- Create a QR code (use [qr-code-generator.com](https://www.qr-code-generator.com/))
- Add to your course syllabus

---

## 🔄 Updating Your Tutorial

Made changes to the files? Here's how to update:

### **Update via Web Interface:**

1. Go to your repository on GitHub
2. Click on the file you want to update (e.g., `index.html`)
3. Click the **pencil icon** (✏️ Edit) in the top right
4. Make your changes
5. Scroll down and click **"Commit changes"**
6. Wait 2-3 minutes for the changes to go live

### **Upload New Version:**

1. Go to your repository
2. Click **"Add file"** → **"Upload files"**
3. Upload the updated file (it will replace the old one)
4. Click **"Commit changes"**
5. Wait 2-3 minutes for updates

✅ **Changes are live!**

---

## 🎯 Method 2: GitHub Desktop (For Frequent Updates)

If you plan to update often, using GitHub Desktop is more efficient.

### Step 1: Install GitHub Desktop

1. Download from [desktop.github.com](https://desktop.github.com/)
2. Install the application
3. Sign in with your GitHub account

### Step 2: Clone Your Repository

1. Open GitHub Desktop
2. Click **"File"** → **"Clone repository"**
3. Select your `sql-tutorial` repository
4. Choose a location on your computer
5. Click **"Clone"**

✅ **Repository is on your computer!**

### Step 3: Make Changes Locally

1. Navigate to the folder where you cloned the repository
2. Edit files using your preferred text editor
3. Save changes

### Step 4: Push Changes to GitHub

1. Open GitHub Desktop
2. You'll see your changes listed on the left
3. Write a brief description (e.g., "Fixed typo in Exercise 3")
4. Click **"Commit to main"**
5. Click **"Push origin"** (top bar)

✅ **Changes are synced to GitHub and will be live in 2-3 minutes!**

---

## 🎯 Method 3: Command Line (Advanced)

For those comfortable with terminal/command line:

### Initial Setup:

```bash
# Create a new directory
mkdir sql-tutorial
cd sql-tutorial

# Initialize git repository
git init

# Add your files
# (Copy index.html, styles.css, tutorial.js, teacher.html here)

# Stage all files
git add .

# Commit files
git commit -m "Initial commit: Add tutorial files"

# Create GitHub repository (via web interface)
# Then connect local to remote:
git remote add origin https://github.com/YOUR-USERNAME/sql-tutorial.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Enable GitHub Pages:
```bash
# Via web interface: Settings → Pages → Select main branch
```

### Future Updates:
```bash
# Make changes to files
git add .
git commit -m "Update: Description of changes"
git push
```

---

## 🎨 Customization Options

### **Change Your Site URL:**

Your default URL is `https://YOUR-USERNAME.github.io/sql-tutorial/`

**To get a custom domain:**
1. Buy a domain (e.g., from Google Domains, Namecheap)
2. In GitHub: Settings → Pages → Custom domain
3. Enter your domain and save
4. Follow DNS setup instructions

### **Add Google Analytics:**

Track how many students visit:

1. Create a Google Analytics account
2. Get your tracking code
3. Add to the `<head>` section of `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-TRACKING-ID');
</script>
```

---

## 🔒 Privacy & Security

### **Protecting teacher.html:**

**Important:** GitHub Pages makes ALL files public. To keep solutions private:

**Option 1: Separate Repository** (Recommended)
1. Create a second private repository for `teacher.html`
2. Only upload student files (`index.html`, `styles.css`, `tutorial.js`) to public repository
3. Keep `teacher.html` in your private repository

**Option 2: Password Protection**
1. Add a simple password prompt to `teacher.html`
2. Use a JavaScript password check (not highly secure, but discourages casual viewing)

```html
<script>
var password = prompt("Enter teacher password:");
if (password !== "YourSecretPassword") {
    window.location.href = "index.html";
}
</script>
```

**Option 3: Different Domain**
1. Host `teacher.html` on a different platform (Google Drive, Dropbox)
2. Share link only with yourself

### **Student Data Privacy:**

✅ **Safe:** This tutorial runs entirely in the browser
- No student data is collected
- No database connections to external servers
- No tracking by default
- FERPA and COPPA compliant

---

## 📊 Monitoring Usage

### **GitHub Insights:**

1. Go to your repository
2. Click **"Insights"** tab
3. See traffic, popular content, and visitors

### **Google Analytics** (Optional):

For detailed analytics, add Google Analytics tracking code as shown above.

---

## 🐛 Troubleshooting

### **"404 - Page Not Found"**

**Possible causes:**
- Pages not enabled (check Settings → Pages)
- Not waited long enough (can take up to 10 minutes initially)
- Wrong URL (should be `YOUR-USERNAME.github.io/REPO-NAME`)

**Solution:**
1. Verify GitHub Pages is enabled
2. Wait 10 minutes
3. Clear browser cache
4. Check the exact URL in Settings → Pages

### **"Changes Not Showing Up"**

**Possible causes:**
- Browser cache
- GitHub Pages rebuild delay

**Solution:**
1. Wait 2-5 minutes after committing
2. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
3. Try incognito/private browsing mode
4. Check commit history to verify files uploaded

### **"CSS/JavaScript Not Loading"**

**Possible causes:**
- Files not in the same directory
- Incorrect file paths

**Solution:**
1. Verify all files are in root directory (no subfolders)
2. Check that `index.html` references `styles.css` and `tutorial.js` correctly
3. Use relative paths (not absolute paths)

### **"SQL.js Not Loading"**

**Possible causes:**
- CDN blocked by school firewall
- No internet connection

**Solution:**
1. Verify internet connection
2. Check if `https://cdnjs.cloudflare.com` is blocked
3. Consider downloading SQL.js and hosting locally

---

## ✅ Checklist for Success

Before sharing with students:

- [ ] All 4 files uploaded correctly
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Waited 5-10 minutes for initial deployment
- [ ] Tested student link (`index.html` loads correctly)
- [ ] Tested SQL playground (queries execute)
- [ ] Tested on mobile device
- [ ] Teacher link saved securely (don't share with students!)
- [ ] Added link to your LMS or class website

---

## 🎓 Tips for Teachers

### **First Time Using GitHub?**
- Don't worry! The web interface is very user-friendly
- You don't need to understand Git to use GitHub Pages
- Watch a 5-minute YouTube tutorial on "GitHub Pages for beginners"

### **Updating Throughout the Semester:**
- Fix typos directly on GitHub (click file → edit → commit)
- Add bonus exercises as students progress
- Update examples based on student feedback

### **Multiple Classes:**
- Create one repository, share same link with all classes
- OR create separate repositories for each class/semester

### **School/District Policies:**
- Check if your school has GitHub accounts
- Verify external hosting is allowed
- Consider school IT approval if required

---

## 🆘 Getting Help

### **GitHub Support:**
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Community Forum](https://github.community/)
- [YouTube: GitHub Pages Tutorials](https://www.youtube.com/results?search_query=github+pages+tutorial)

### **This Project:**
- Review [README.md](README.md) for project details
- Check [QUICKSTART.md](QUICKSTART.md) for student guide
- Email your IT department if blocked by firewall

---

## 🎉 You Did It!

Your tutorial is now:
- ✅ Online and accessible 24/7
- ✅ Free to host
- ✅ Easy to update
- ✅ Shareable with students worldwide

**Your tutorial URL:**
```
https://YOUR-USERNAME.github.io/sql-tutorial/
```

**Share this link with your students and start teaching!** 🎓

---

**Need help?** Review this guide or search "GitHub Pages tutorial" on YouTube for video walkthroughs.
