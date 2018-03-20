# Git workflow

We are using **feature branch workflow** - each user story 
is implemented in a separate branch and then merged to `master` 
after review. 

If a branch is ready to be reviewed and potentialy
merged, the developer of the feature should contact repository
maintainer (Doruk in our case) and ask him to review the branch
and merge it to the `master` branch.

Recommended branch name is a "slug" version of corresponding user story
name in Agilefant (all letters lowercase and dashes instead of spaces).

There is one case when developers can commit directly to the `master` branch: 
when changes made affect the project as a whole, not only one feature: 
this includes for example architecture, build system or project plan changes.
Extra caution is required in this case the application should be tested carefully 
before pushing.

## Reasoning

We decided to use feature branches workflow for several reasons:

- paralel development of multiple features,
- tracking between code in the repository and user stories in Agilefant,
- reviewing the code before merging to master.

We also identified some disadvantages of other possibilities:

- centralized workflow would be a mess in a team of five people,
Would be quite hard to keep track of which commit belongs to which user story
and who is working on what,
- gitflow is from our perspective good for development of a product which is already
used by customers, which is not our case,
- forking workflow is suitable for open-source projects development but for our case
it feels overengineered and requires some extra work.

## Commits

Recommended commit and push frequency is at least once a day during which some
work was done. Commits can contain unfinished work in case of feature branches.
In case of directly modifying the `master` branch only fully functioning code can be
commited and the 1 day limit can be violated if required.

Recommended commit message format is one sentence starting with a verb in simple past tense
like *Added*, *Fixed*, *Implemented*, *Modified*, etc. There should be no period character in
the end of the sentence.
