---
title: "Running an Iterated Prisoner's Dilemma Tournament in a Classroom"
date: "2026-08-19"
author: muhammad-usman
category: "Game Theory"
tags: ["Game Theory", "Python", "Flask", "Sandboxing"]
excerpt: "Students write Prisoner's Dilemma strategies, test them on their own laptops, and enter a class tournament. Updated for the October 2026 version of the tool."
status: published
---

*Updated in October 2026. The app is now a one-click download, settings live inside it, and the OS Simulation averages many runs.*

Everyone in a game theory course hears that Tit-for-Tat won Axelrod's tournaments. Almost nobody gets to try it. We wanted students to write a strategy, watch it lose to something a classmate wrote in four lines, and go back and fix it. So we built a tool for that.

You write a short Python function, practise it against your own ideas and against your classmates, and enter your best one into a class tournament. This post explains how it works and how to use it.

## Two programs instead of one

The obvious design is one website where students paste code and a server runs everything. That falls apart quickly. A round robin over forty strategies is 780 matches, each a few hundred rounds, each round running two pieces of student code in a sandbox. A free hosting plan cannot do that and serve pages at the same time. A student's laptop finishes it in seconds.

So the tool is split in two. The practice app runs on the student's computer and does every simulation. The class website runs no simulations at all. It handles logins, submissions, the list of strategies and the published results.

This has a nice side effect. Practice keeps working when the website is down, and the website stays small enough to run for free. It also means the website must treat the app as untrusted, because anyone can change code running on their own machine. So the website checks every strategy again on its own, and the app's checks are there to catch honest mistakes early.

## Getting started

Students download one file from the Releases page and double click it. There is a version for Windows, Mac and Linux, and no Python install is needed. The browser opens at the app, and that is it. People who want to read the code can still clone the repository and run it with Python.

To see classmates' strategies, students open the Settings tab, paste the website address and class token from the instructor, and press Connect. The app tests the connection and remembers it, even after a new version is downloaded.

## Writing a strategy

A strategy is a function that the app calls once every round. It returns `'C'` to cooperate or `'D'` to defect. Here is Tit-for-Tat.

```python
def tit_for_tat(last_moves, my_history, opponents_histories, meta):
    if not last_moves:
        return 'C'
    return last_moves[0]
```

The four inputs are the same in every game. `last_moves` holds each opponent's last move, `my_history` holds your own moves, and `opponents_histories` holds everyone else's. `meta` carries extra details, such as the round number and a random number generator.

That generator matters more than it looks. If you use `import random`, your results change on every run and a bug you saw once may never come back. `meta['rng']` is seeded by the run, so a random strategy still gives the same result for the same seed.

```python
def generous_tit_for_tat(last_moves, my_history, opponents_histories, meta):
    if not last_moves or last_moves[0] == 'C':
        return 'C'
    if meta['rng'].random() < 0.1:
        return 'C'
    return 'D'
```

The name you give a strategy in the app is only a label, so "Grim Trigger" with a space is fine. The one hard rule is to return exactly `'C'` or `'D'`. A strategy that returns anything else, crashes or loops forever loses that match, and the results say which strategy failed and why. The app's README has a small example for every field of `meta`, and a short PDF guide comes with each release.

## Three games, one function

The same function plays three different games.

**1v1** is Axelrod's format. Every strategy plays every other one. This is where students learn that always cooperating gets you eaten and always defecting leaves you with nothing.

**N-Player** puts everyone in one group moving at once. There is no single opponent to copy, so students have to decide what to do with a whole list of moves. You can choose how the group is paid, for example a public goods game where cooperators pay into a shared pot.

**OS Simulation** turns the function into a CPU scheduler. Cooperating means giving up the processor and defecting means holding on to it. A strategy that was a good citizen in 1v1 often turns out to be a poor scheduler, which surprises people.

![The 1v1 results panel with ranking weight sliders, a leaderboard of four strategies, a weighted score bar chart, a points against cooperation scatter plot, a radar chart and a head-to-head grid where draws are marked with an equals sign.](/content-images/ipd-1v1-results-v2.webp)

## Making the results fair

Ranking by raw points rewards whoever played the most rounds, so the leaderboard uses a weighted score made of win rate, cooperation and average points per round. Each part is scaled between 0 and 1 first, so a longer match never helps. Sliders let you change the weights and watch the ranking move, which shows quickly that "best" depends on what you measure.

The OS Simulation needed more care. Each run makes up a random set of tasks, and one run can be lucky. So each strategy now runs ten times on different task sets, and every number comes with a plus or minus range. If two strategies' ranges overlap, neither is clearly better, and the page says so. The app also warns when the simulated computer has more work than its cores can handle, because then the waiting times say more about the workload than about the scheduler.

![OS Simulation results averaged over ten runs, with a plus or minus range next to every metric, a warning that the cores cannot keep up in three workloads, and charts comparing four strategies with a plain Round Robin baseline.](/content-images/ipd-os-simulation-v2.webp)

## Practising and submitting

Refresh Gallery pulls every submitted strategy from the website. Students tick the ones they want to face, and the list is saved so practice works offline. A strategy from the Hub tab can be opened straight into the editor. For code you did not write, sandbox mode runs each strategy in a separate process first and leaves out anything that hangs or crashes.

Submitting starts on the student's own machine. The app checks the code and plays a short test match, so mistakes show up in about a second. Then the class website opens with the strategy filled in, and the student logs in to confirm. The website checks the code again before saving it.

## For instructors

The official tournament runs in the app with the real roster. Submit results sends it to the website as a draft, and you publish it right away or schedule a reveal time. Bots and practice strategies are managed on the website, which can also download every submitted strategy as a ZIP file for safekeeping.

If you want to run this for your own course, the part worth copying is the split. Pushing the work to the students' machines and treating them as untrusted is more effort than trusting them, but it stays free to run and honest about what it checks.
