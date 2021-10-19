---
title: 'Bouncer Mail'
date: 2021-09-10
weight: 1
---

An email address is pre-requisite for almost every activity online, as well as a rapidly growing share of ordinary meatspace activities. Not only is it annoying being spammed by companies you only interacted with once - even if you unsubscribe, it's likely that your email has been or will be harvested for sale to spammers and scammers.

<!--more-->

#### Motivation

Many email providers (including Gmail, Outlook and sendmail) provide a feature known as "plus addressing" which allows for email tagging and forwarding. If I have registered `example@domain.com` then any mail sent to `example+tag@domain.com` will also be sent to me, regardless of what `tag` was actually provided.

This allows users to provide something _other_ than their primary mailbox when asked for their email address. This gives users a way of knowing which site leaked their email, if they start getting spam. In theory it should also make it harder for data harvesters to track activity between `example+etsy` and `example+pinterest`.

However:
1. It is trivially easy to strip anything between `+` and `@` in an address, giving back the primary mailbox
2. Tags don't protect you from tracking when the email provider is also the data harvester (e.g. Gmail)
3. Email providers generally don't provide tools to help users track and understand their tagged mail

Furthermore, clicking "unsubscribe" from an email list often does not remove your email from their database, it just marks you as do-not-contact. When your personal email address could last for a decade or longer, it doesn't seem worth sharing that info hundreds of times at every cart checkout and form filling.

All of these issues are resolved by having a "hand-it-out" email address which is completely separate from the primary personal mailbox. Think bouncer instead of bodyguard.

#### User Story
The idea is to provide every user with their own email subdomain, like `example.bouncermail.com`. Navigating to that address and logging in, they will be able to see all mail sent to _all addresses_ at that domain -- each tag is given by `tag@example.bouncermail.com` and has its own inbox.

When the user logs in, therefore, they see a kind of global inbox which collects all these tag-inboxes in one place. Some tags might be long-term addresses which automatically forward new mail to the personal mailbox. Others might be piling up with unwanted spam, prompting actions like unsubscribing, clearing or deactivating the tag.

It's a common problem that users recycle passwords across sites, so when one site gets breached their email/password combination can be used to hack a bunch of other accounts. Using entirely different email addresses across different sites reduces the risk of such an attack. Nonetheless, Bouncermail can also make periodic scans of websites like [HaveIBeenPwned](https://haveibeenpwned.com/) to alert users when their details have been leaked.

#### Architecture
AWS will underpin this project -- Simple Email Service (SES) will do the heavy lifting when it comes to mail; everything else is TBD!

Currently (12 October) assessing whether I can learn Rust quickly enough to apply it to this project.


<br><hr><br>