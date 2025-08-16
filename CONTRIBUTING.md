# Contributing to ScarWallet UI

First off, thank you for considering contributing to ScarWallet UI. It's people like you that make open source great.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/ZoaGrad/scarwallet-ui/issues/new/choose)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

### Fork & create a branch

If this is something you think you can fix, then fork the repository and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):

```bash
git checkout -b 123-add-a-button
```

### Get the style right

Your patch should follow the same conventions & pass the same code quality checks as the rest of the project.

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with the latest upstream version of master.

```bash
git remote add upstream git@github.com:ZoaGrad/scarwallet-ui.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout 123-add-a-button
git rebase master
git push --force-with-lease origin 123-add-a-button
```

Finally, go to GitHub and make a Pull Request.

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing and merging, check out this guide on [merging vs. rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).

---
*This contributing guide was adapted from the [Contribution Guide for Reaction](https://github.com/reactioncommerce/reaction/blob/master/CONTRIBUTING.md).*
