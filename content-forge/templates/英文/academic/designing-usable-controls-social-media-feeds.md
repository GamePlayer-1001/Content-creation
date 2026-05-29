---
title: "Designing Usable Controls for Customizable Social Media Feeds"
source: "arXiv"
url: "https://arxiv.org/html/2509.19615v1"
author: "arXiv authors"
type: "academic_preprint"
language: "en"
template_kind: "academic_reference"
license_note: "Open full-text web source; saved locally for style-analysis reference."
---
# Designing Usable Controls for Customizable Social Media Feeds

> Source: https://arxiv.org/html/2509.19615v1

# Designing Usable Controls for Customizable Social Media Feeds

Frederick Choi

fc20@illinois.edu

and

Eshwar Chandrasekharan

eshwar@illinois.edu

University of Illinois Urbana-Champaign Urbana Illinois USA

(11 September 2025)

Abstract.

Personalized recommendation algorithms deliver content to the user on most major social media platforms. While these algorithms are crucial for helping users find relevant content, users lack meaningful control over them. This reduces users’ sense of agency and their ability to adapt social media feeds to their own needs and values. Efforts have been made to give users more control over their feeds, but usability remains a major barrier to adoption. Drawing upon prior work in designing teachable social media feeds, we built Pilot , a novel system of controls and feedback mechanisms on BlueSky that are expressive, intuitive, and integrated directly into the feed to allow users to customize their feed while they browse. Our user study suggests the system increases the user’s sense of agency, and encourages them to think more critically about curating their feeds. We synthesize design implications for enhancing user agency over social media feeds.

Personalized content curation, user agency, interactive machine teaching

† † ccs: Human-centered computing Social networking sites

##

1. Introduction

Personalized recommendation algorithms are responsible for serving users content on most major platforms including X/Twitter, Instagram, Facebook, YouTube, and TikTok. They are crucial in combating information overload and helping users find relevant content. However, users lack meaningful control over what is recommended to them. This reduces their sense of agency and their ability to adapt social media feeds to their own needs and values, and leaves that power in hands of the platform owners.

While personalization algorithms used on these platforms are designed to adapt to the user, they do so by attempting to infer a user’s preferences from their behavior. They use signals such as liking, commenting, and dwell time as inputs to predict what content the user is most likely to engage with (Narayanan, 2023 ) . But when users try to exert control over their feed, typically through strategic interactions on the platform based on folk theories they had developed of how these algorithms work (DeVito et al., 2018 , 2017 ; Eslami et al., 2016 , 2015 ; Karizat et al., 2021 ; Siles et al., 2020 ; Simpson et al., 2022 ) , their sense of agency remained low as the efficacy of their strategies remained unclear (Burrell et al., 2019 ; Eslami et al., 2016 ) .

Designing usable controls and feedback mechanisms that give users meaningful control over their feeds is a difficult problem. Prior work has shown the importance and the challenges of having controls that are easily understood while being expressive enough to be able to make a meaningful difference in the user experience, as well as the challenge of getting users to interact with the controls in the first place (Hsu et al., 2020 ; König, 2022 ; Harambam et al., 2019 ; Jin et al., 2017 ; Jhaver et al., 2023 ; Jannach et al., 2017 ) .

The personalization algorithms described above represent one extreme, where the user is constantly giving feedback to the system, but this still does not give the user meaningful control. These are expressive enough to where they can sometimes learn the user’s preferences to a startling degree of accuracy (Simpson et al., 2022 ) , but the one-size-fits-all algorithm fails to capture the disparate needs and values of their global user bases (Jiang et al., 2023 ) . And since the algorithm only learns from implicit feedback based on the user’s behavior, it makes it very difficult for the user to understand how to alter the behavior of the algorithm in the particular way the user wants to.

While users are stuck with the algorithm the platforms owners decide to deploy on these major platforms, decentralized platforms offer a promising future for improving user agency. For example, BlueSky, a decentralized platform launched in 2023, has publicly available APIs for users to create, share, and discover alternative feed algorithms (Kleppmann et al., 2024 ; Team, 2023 ) , giving users full control over their feed, at least in principle. However, the challenge of translating one’s preferences into a program written from scratch, in addition to technical knowledge required to be able to implement, and host a custom feed poses a significant barrier to most users.

Interactive Machine Teaching (IMT) is a framework that offers an approach to lower this barrier and increase user agency. IMT is a framework for designing systems that focuses on the iterative refinement of algorithmic systems through continuous user feedback, and has been applied to various domains (Ng et al., 2020 ; Ramos et al., 2020 ; Simard et al., 2017 ; Wall et al., 2019 ) . In this framework, the system/algorithm is the “learner,” and the user is the “teacher” who observes the behavior of the algorithm and provides feedback.

However its application in social media (Feng et al., 2024 ) revealed that “teaching” is only part of the equation, and that teaching should integrate into the user’s workflow, to remain accessible without interfering with their usual activities on social media. We thus also focus on how we can integrate teaching controls and feedback mechanisms into a seamless experience for the user, synthesizing three overarching design objectives

to guide the design of a system of usable controls for customizing social media feeds:

( DO1 )

Expressiveness. The system should support a wide variety of outcomes, allowing the user to express nuanced preferences through the controls and feedback mechanisms.

( DO2 )

Understandability. Users should be able to understand how the system produces its outcomes, and easily identify how to use the controls and feedback mechanisms to modify its behavior.

( DO3 )

Integration. It should be easy for users to integrate teaching into their existing workflow, and it should be easy for users to engage in teaching tasks alongside their usual activities on social media.

In this work, we design and implement Pilot : a working prototype of a customizable social media feed with integrated controls and feedback mechanisms. Through a preliminary user study, we evaluate the prototype against the design objectives, and how they impact usability overall.

We study how Pilot influences user behavior when browsing, how they think about their feeds, and we discuss implications for user agency in social media, as well as broader implications for aligning social media feeds to human values.

In addition, by studying how users incorporate these controls into their workflow, and how they use Pilot to achieve their goals from an IMT perspective, we also shed light on how algorithms can be designed to better align with user expectations and support the user’s role as a teacher.

We present implications for designing usable controls and feedback mechanisms on social media feeds, and discuss broader implications of increasing user agency over personalized feeds on social media.

##

2. Background

There is a long history of research in HCI around the design and audit of content curation systems and moderation practices on social media.

These range from centralized systems curated by people or algorithms directly affiliated with the platform (Eslami et al., 2015 ; Wang and Diakopoulos, 2021 ; Bajpai et al., 2022 ; Chan et al., 2024 ; Wang et al., 2024 ) , systems where the responsibility is distributed across moderators or owners of communities hosted by the platform (Choi et al., 2025 ; Lambert et al., 2024 , 2025 ; Jhaver et al., 2022 ; Seering et al., 2024 ) , and personalized systems with end-user facing tools (Im et al., 2020 ; Chang et al., 2022 ; Feng et al., 2024 ; Jhaver et al., 2023 ; Huang et al., 2024 ; Wang et al., 2025 ) . Some have focused on to helping and understanding how moderators detect and remove low-quality contributions (Chandrasekharan et al., 2019 ; Choi et al., 2023 ) , as well as detecting and promoting high-quality contributions (Wang and Diakopoulos, 2021 ) .

To inform the design of Pilot , we review literature on user agency, user controls on social media feeds, and interactive machine teaching, and synthesize our design objectives.

###

2.1. User Agency on Social Media Platforms

The personalized recommendation algorithms that major social media platforms employ have raised concerns regarding the reduction of user agency on social media (Lukoff et al., 2021 ; Narayanan, 2023 ; Harris, 2019 ) .

These algorithms infer the kind of content to recommend based on signals of user behavior, such as likes, clicks, and dwell time. But users only have indirect control of this process, and are unable to communicate what they want directly. The lack of transparency about how these algorithms learn lead users to develop folk theories, and to try strategically interacting with content of the platform based on these theories to achieve their outcomes (DeVito et al., 2018 , 2017 ; Eslami et al., 2016 , 2015 ; Karizat et al., 2021 ; Siles et al., 2020 ; Simpson et al., 2022 ) , even avoiding content they would otherwise want to see just to avoid influencing the future recommendations in an unwanted way (Simpson et al., 2022 ) . However, the lack of clear feedback means these strategies fail to increase users’ feelings of agency and their ability to meaningfully and intentionally influence their feeds (Burrell et al., 2019 ; Eslami et al., 2016 ) .

Reduction in user agency leads to mistrust of recommender systems, questions on how data is being used and what platforms’ real objectives are (Harambam et al., 2019 ) . This mistrust is not necessarily misplaced, as platforms’ priorities are often misaligned with user needs. Platforms often prioritize engagement to increase profits. However some of what gets promoted, while engaging, has negative impacts on the user, e.g. misinformation, sensationalized content with little informative value, and emotionally manipulative content (Narayanan, 2023 ) .

Users may feel like they are being silenced, or that the content given is polarizing or reinforcing stereotypes (Simpson and Semaan, 2021 ; Narayanan, 2023 ) . Users are concerned that recommender systems make them less likely to think critically about what they content want to see, what their preferences are, and how they should consume content online (Harambam et al., 2019 ) . Users can be pulled unaware into rabbit holes, which is particularly dangerous when young viewers are exposed to content that promotes suicide or self harm (Smith, 2021 ) .

As we will discuss in more detail, the approach to restoring user agency is to give users more meaningful, intentional control, and the power the customize their feeds. Users should be able to directly influence the behavior of the feed algorithms to achieve their goals. However, user needs are varied and do not easily fall under one umbrella. Thus, the system should be flexible enough to support as wide a variety of needs as possible. This leads to our first design objective:

( DO1 )

Expressiveness. The system should support a wide variety of outcomes, allowing the user to express nuanced preferences through the controls and feedback mechanisms.

###

2.2. Feed Control and Customization

Feed controls and the ability for users to customize their feeds has many benefits. They are one of the ways users understand the feed curation algorithms (Eslami et al., 2016 ) , and they increase user satisfaction and feelings of control (Burrell et al., 2019 ; Harambam et al., 2019 ; Jin et al., 2017 ; Vaccaro et al., 2018 ) . They help align the content on the feeds with the interests of the user (Harper et al., 2015 ; Hsu et al., 2020 ) and increase engagement (Jannach et al., 2017 ) . They may help avoid the problem of undesirable biases in algorithmic systems (König, 2022 ) . Feed customization offers a solution where a one-size-fits-all solution to shaping online content would not be able to serve the disparate needs of millions of end users given the normative differences across cultures and communities (Jhaver et al., 2023 ; Jiang et al., 2023 , 2021 ; Weld et al., 2022 ) .

Explicit controls allow users to manipulate their feed more directly. For example, BlueSky (Kleppmann et al., 2024 ) , a Twitter-like social media platform launched to the public in 2024, and their approach to composable moderation also gives users more flexibility by allowing users to subscribe to various content labelers and specify how labeled content should or should not be displayed on their feed (Com, [n. d.] ) . SkyFeed (Fea, 2023 ) is a third-party tool for BlueSky that allows users to create their feeds using a rich set of controls. Feedback mechanisms are another way of giving users a more direct way to control their feeds. Such mechanisms allow users to provide direct feedback on recommended items in the form of a thumbs-up/down which the system can use to improve its recommendations (He et al., 2016 ; Zhao et al., 2013 ) . We see examples of this in practice as well: On Twitter, users can explicitly tell the algorithm that they want to see fewer posts similar to one they had just hidden, and on BlueSky, users can tell the default Discover algorithm that they would like to see more or fewer similar posts.

However, despite the fact that users desire to customize their feeds (Hsu et al., 2020 ) there are barriers that prevent users from effectively utilizing feed customization options to take control over their feeds. Some users are not even aware that an algorithm curates their feeds at all (Eslami et al., 2016 ; Gran et al., 2021 ) . This highlights the fact that algorithmic literacy should not be expected of all users, and that efforts need to be made to ensure that users can make decisions based on an accurate mental model of the system they are trying to manipulate. In addition, the mere existence of such controls is not enough. Hsu et al. (Hsu et al., 2020 ) studied Facebook—which also offers a variety of controls on their feeds—and found that the purposes of the controls need to be clear to the user, because if the options are confusing or the outcomes are unclear, then people tend not to change them. They also found that users need to be made aware of the controls and possible outcomes, as some users who are unaware that a particular outcome can be achieved will believe it is impossible, and will not search for the corresponding controls.

Finally, even if the user is aware of and understands all of the controls, there is still a barrier as it is non-trivial for users to formulate goals in a way that can be operationalized in an algorithmic curation setting. Users must first adopt a “computational mode of thinking” (König, 2022 ) and relate their own preferences to the controls and feedback mechanisms that are presented to them. This highlights the need to design controls and feedback mechanisms in a way that aligns with the way users think about their preferences, and which helps users understand and articulate their own preferences by giving them a language of feedback in which to express them. We synthesize these needs in our second design objective:

( DO2 )

Understandability. Users should be to understand how the system produces its outcomes, and easily identify how to use the controls and feedback mechanisms to modify its behavior.

###

2.3. Interactive Machine Teaching

There is a natural tradeoff between the expressiveness of a system and its understandability. Users get the best recommendations with more expressive system that gives user a higher level of control, but this increases complexity, increasing cognitive load and reducing understandability (Jin et al., 2017 ) .

In this work, we apply the Interactive Machine Teaching (IMT) framework to feed customization systems on social media, building on prior work in IMT (Ng et al., 2020 ; Ramos et al., 2020 ; Simard et al., 2017 ) and its application within social media feeds (Feng et al., 2024 ) to help navigate this tradeoff. IMT is a framework for designing systems that allow users to build complex algorithmic models without requiring technical skills of the user. One of the core principles of IMT is iterative refinement through continued feedback from the user over time. It differs from similar approaches such as reinforcement learning with human feedback (RLHF) in that it focuses on the role of the user as a teacher, and on optimizing how the user’s knowledge can be leveraged to build better models.

In the context of social media, Feng et al. ( 2024 ) applied this framework to map out the design space of teachable social media feeds.

They found that teaching must live alongside users’ usual activities on social media, and that the effort required of users to customize their feeds should generally be minimized.

They suggest the controls should available for when users want to teach, but should not be intrusive so users can just browse without spending extra cognitive effort on customizing their feed. The controls should also be integrated directly into the feed so users do not have to disengage from the feed when they want to teach.

They also highlight the importance of allowing the user to teach over short and long time scales, as factors external to the content of posts, like the user’s mood, can impact their preferences in the short term, and also because user preferences can change gradually over longer periods time. This also enables the user to spread out the effort of customizing their feed over a period of time.

They also find that some users would rather separate content that they find valuable on their own, but jarring when put in the same feed (e.g. politics in a vacation feed), thus highlighting the importance allowing users to create multiple feeds for different purposes.

Building on these guidelines, we aimed to integrate our controls and feedback mechanisms directly into the feed, keeping them accessible but unobtrusive, to facilitate switching between teaching and browsing tasks across all the feeds they create. Our third design objective encompasses these goals:

( DO3 )

Integration. It should be easy for users to integrate teaching into their existing workflow, and it should be easy for users to engage in teaching tasks alongside their usual activities on social media.

##

3. Design

Next, we describe how we built Pilot in detail.

We first detail the inner workings of the system architecture and the custom feed generation algorithm in Section   3.1 and Section   3.2 to provide context as to what the user is able to control. Finally, in Section   3.3 , we detail the user interface through which the user can create and configure these custom feeds using our prototype.

###

3.1. System Architecture

The Pilot system is built on top of the existing BlueSky API and web client. It consists of a client, which is a fork of the BlueSky web client which was modified to add the feed customization interface, and a server which stores the users’ configurations for their customized feeds, and which generates and serves feeds to the user. The controls and feedback mechanisms in the client interface directly communicate with the server to update customizable feeds. For customized feeds created with our tool, the client sends a request to the server, and the server communicates with the BlueSky API to fetch posts from the configured source feeds. Note that these source feeds are also usually self-hosted by a third-party, with the exception of a few which are hosted by BlueSky. The BlueSky API provides a common interface which the server uses to query the source feeds. The server then analyzes the posts from the source feeds, and combines them into a single feed which is sent to the client directly.

###

3.2. Feed Generation

Figure 1. Flowchart illustrating the feed generation pipeline. When the client requests a feed, the server first fetches posts from the user-configured sources via the BlueSky API. These posts are then filtered based on user-configured filters. These two steps are repeated until the number of posts reaches the target batch size. The posts are then sorted based on user-configured sorting options, then finally sent back to the client.

The feed generation algorithm forms the core of Pilot . A key challenge to overcome was parameterizing the algorithm in such a way that is expressive and easy to understand, allowing users to create a wide range of feeds (DO1) while keeping the complexity low and maintaining a clear link between controls and outcomes (DO2). At the same time the algorithm needs to be performant, so that feeds can be generated in a reasonable amount of time.

Our solution was to allow users to define their own sources , filters , and sorting options . Sources are the starting points of where posts should be pulled from to construct the feed. Filters can be used to white-list or black-list posts based on features of the post. Sorting options determine how the feed should be sorted, and users can control how posts are sorted based on features of the post.

Recall that the primary focus of our study was to investigate how to design the user interface to integrate controls and feedback mechanisms into the user’s existing workflow on social media. We thus chose to keep things simple, using just two easily understood, surface-level features: the author of the post and the keywords it contains. However, this can easily be extended to encompass more features such as the type of media contained in a post, and even higher-level features that use machine learned models. We discuss more ways our system can be extended in Section   6.3 .

####

3.2.1. Algorithm Overview.

When the user requests posts from a customized feed, the server first constructs a feed based on the configured sources, filters, and sorting options, then serves posts from that feed to the user. The feeds are constructed in batches. These batches collect posts based on the configured sources and filtering options, then sorts the posts within each batch based on the configured sorting options. This process is explained in more detail below, and is also summarized in Figure   1 .

####

3.2.2. Batching.

To construct a batch, first, posts are collected from each source, 100 posts at a time from each source. To do this, the server sends an authorized request to the BlueSky API to fetch posts from each feed as if the user was sending a request directly. This allows us to serve the user posts from personalized feeds, such as their “Following” or ”Discover” feeds.

These posts are then checked against each of the filtering criteria. If any “include” filters are defined, then posts must match some ”include” filter to remain in the batch. That is, posts which do not match any “include” filter are discarded from the batch. Additionally, posts which match any “exclude” filter are likewise discarded. If no “include” filters are defined, then only posts which match an “exclude” filter are discarded.

This process of fetching and filtering posts is repeated until the batch hits the target number of posts. For our study, we set a fixed target size of 500 posts per batch.

####

3.2.3. Sorting.

Posts are then sorted within each batch. The “Original/Interleaved” option keeps posts in their original order from their respective source feeds. If there are multiple source feeds, the posts from each feed are interleaved, inserting the first post from the first source first, then the first post from the second source, all the way until to last source before inserting the second post from the first source, and so on. The “Chronological” option is similarly straightforward, sorting posts in order from newest to oldest.

The “Priority” option sorts posts in descending order of priority, so that the highest priority posts are shown first. The priority of each posts is determined by the following formula, inspired by the HackerNews ranking formula 1 1 1 https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d :

Priority ​ ( p ) = − log ⁡ ( 2 + Age ​ ( p ) ) + W ​ ( p ) \text{Priority}(p)=-\log(2+\text{Age}(p))+W(p) |

where Age ​ ( p ) \text{Age}(p) represents the time since the post was created, in hours, and W ​ ( p ) W(p) is configured by the user. In more detail, the user can configure weights that increase or decrease a post’s priority if a condition is met. For example, a user can assign a weight of + 4 +4 to the condition that a post mentions “HCI” to give any post p p that contains the substring “HCI” a priority of − log ⁡ ( 2 + Age ​ ( p ) ) + 4 -\log(2+\text{Age}(p))+4 . With no configured weights, the feed is simply sorted chronologically. However, weights allow the user to bring certain posts closer to the top of the feed or push them toward the bottom.

####

3.2.4. Extending.

When the posts from the batch are exhausted and the client requests more posts, another batch is created, continuing to pull posts from where it left off in each of the source feeds, then filtering and sorting posts within the batch. These posts are then appended to end the feed. Note that while posts will be correctly sorted within each batch, posts across batches may be out of order. For example, this can happen if a source feed is not sorted chronologically, and the second batch includes a post that is newer than the oldest post in the first batch. This is a limitation of the BlueSky API, which does not support any additional parameters when requesting posts from a feed other than a cursor which indicates the next “page” to fetch. In other words, posts can only be retrieved sequentially, and only in the order in which the source feed sends them. However, this limitation can be mitigated by choosing a larger batch size. Of course, a larger batch size will mean it will take longer to generate the feed, so the right balance must be struck between performance and consistency. For this study, we chose a target size of 500 posts per batch, meaning that the user will not notice any break in sorting until at least the 500th post, and the server can usually generate the feed within 10 seconds, with the bottleneck being the performance of the source feeds themselves.

###

3.3. Feed Customization Interface

####

3.3.1. Screens

Figure 2. Screenshots of the Home screen and Feed screen. Feeds the user creates will be accessible from the home screen as another tab (A). Users can enter the Feed screen by pressing the hashtag button in the top right (B). Users can open the control panel directly from the home screen with (C). Users create new feeds from the Feeds screen with (D).

Our prototype modifies the home screen and the feed screen, and adds a new screen: the sandbox screen.

##### Home Screen

( Figure   2 ) The home screen is where users would typically browse their feeds from. The changes we made to this screen were minimal, only adding a button that allows the user to access the control panel (described in Section   3.3.2 ) directly from the home page while browsing a custom feed. This allows the user to open the control panel and access the inline editor to customize their feed while they are in the middle of browsing, allowing for a smooth transition between customizing and browsing. When the control panel is open, users can manually refresh the feed to apply their customizations.

##### Feed Screen

( Figure   2 ) The feed screen was modified to list the user’s custom feeds made with our system, and it allows users to create new custom feeds. In keeping with BlueSky embracing users having a multitude of feeds to browse, we allow users to create and customize multiple feeds as well. Users can access the sandbox screen for any of their custom feeds from this screen.

##### Sandbox Screen

( Figure   6 )

We added a dedicated screen for users to create and configure their custom feeds, which we call the Sandbox. After creating a feed, it will added to feed screen as well the home screen, where it will appear as a new tab. The control panel is always open on the sandbox screen, and the feed will automatically refresh whenever the configuration changes. This is intended to aid users when they are first setting up a new feed, or whenever they focused on customizing and curating their feed.

Figure 3. Screenshot of the control panel from the sandbox view. The user can rename their feed by pressing (A). From the control panel, users can enter the sources editor (B), filters editor (C) or sorting editor (D). The feed is displayed to the user below the control, and updates as the user customizes the feed. Additionally, while the control panel is open, a breakdown of the priority score calculation for each post is shown (E).

Figure 4. Screenshot of the filter editor. Users can review filters they hae already set. Users can manually input a filter (A), or sort the filters by exclude/include (B). Users can also remove filters they have previously set (C).

Figure 5. Screenshot of the sources editor. Users can choose from sources they have pinned to their home screen (A), or search for feeds to add (B). Users can remove feeds as they had previously selected as sources as well (C).

Figure 6. Screenshots of the sorting editor. Users can change the sorting method (A). If priority sorting is selected, users can review weights they have previously assigned. Users can also manually assign weights to keywords or authors (B). Users can sort by weight assigned (C) to get a better overview. Users can adjust weights of existing criteria (D), or delete previously set weights (E).

####

3.3.2. Control Panel

The control panel Figure   6 provides the user the tools to reflect on and manage their feeds’ configurations.

The control panel consists of three sub-components: the source editor, filter editor, and sorting editor.

##### Source Editor

( Figure   6 ) The source editor allows the user to configure which source feeds their custom feed should pull posts from. The user can select feeds to add as sources, or remove feeds that were previously added. This view shows the user’s previously saved feeds, feeds which are popular on the BlueSky network, and incorporates a search option should the user want something more specific.

##### Filter Editor

( Figure   6 )

The filter editor allows the user to configure which posts should be included/excluded based on certain conditions. It shows a table where each row corresponds to a filtering predicate, which comprises of a filter mode (include or exclude), the feature type (keyword or author), and the feature value (i.e., what keyword or author to match). Users can edit any part of the filtering predicate by clicking on it. Users can create new filtering predicates or delete existing ones. Users can also sort the table to get a better overview of what posts are being included/excluded, helping users understand why certain posts are/are not being shown on the feed (DO2).

##### Sorting Editor

( Figure   6 )

The sorting editor allows the user to configure how their feed should be sorted. It allows the user to select between “Original/Interleaved”, “Chronological”, and “Priority” sorting methods, which are described in Section   3.2 . When “Priority” sorting is selected, the editor shows a table of sorting options, similarly to the filter editor. Each sorting option specifies the feature type and value, as well as a weight or priority that should be given to posts which have the feature. Users can create, delete, and edit sorting options. Users can also sort the table by weight to get a better overview of how their feed is being sorted, thus helping users understand how things are currently being sorted (DO2).

In addition, while the control panel is open and the “Priority” sorting method is selected, a breakdown of how the priority was calculated is shown at the top of each post ( Figure   6 , circle F). This is intended to make the sorting algorithm more transparent, and help the user understand how they might be able to change the priority of posts to make them move up or down the feed (DO2).

####

3.3.3. Inline Editor

Figure 7. Screenshot of the inline editor. Users can click on a highlighted keyword or author to open the inline editor. Items in the inline editor are then highlighted blue in the feed (A). From here, users can adjust the priority of posts with that keyword or author (B), or create a filter based on it (C).

( Figure   7 ) When the control panel is open, the author of and certain keywords in each post are highlighted. The user can click on any highlighted portion of a post to bring it into the inline editor. The inline editor feedback is prepopulated with the selected keyword or author, and from here the user can increase/decrease the priority of posts with that feature, or create a filter based on it. By pre-populating the editor, this allows users to quickly provide feedback to the system, and customize how their feeds are sorted and filtered as they browse (DO3).

##

4. Evaluation

We recruited participants by posting a message in several university Slack workspaces. We recruited 7 participants total (see Table   1 for details). The gender distribution was 2 male, 5 female. The race distribution was 4 Asian, 1 Black or African-American, 2 White. 5 participants self-rated their familiarity with programming and/or automation highly (4 or 5 on a 5-point Likert scale), and all participants rated their overall confidence with using technology highly. During the interview, the interviewer first walked the participant through the process of creating a feed, covering all of the source, filters, and sorting options, using the inline editor as well as the filter and sorting editors, and finally accessing the control panel from the home screen.

After this tutorial, the feed controls were reset and users were asked to create a feed about a topic they are interested in, and to think aloud as they used the Pilot prototype. After 15-20 minutes, users were prompted to try using any features they have not used yet, and to try creating a second feed. After another 5-10 minutes, the interviewer collected responses from the user in a semi-structured interview. The whole interview lasted about 1 hour, and participants were given a $20 Amazon gift code as compensation. Participants responses and observations of participants’ interactions with Pilot were analyzed by the first author using open coding to extract themes from qualitative data.

Gender |

Race |

Has Used BlueSky |

Familiarity with |

Programming/Automation |

(5-point Likert scale) |

Confidence with |

Using Technology |

(5-point Likert scale) |

P1 |

Female |

Asian |

No |

4 |

4 |

P2 |

Male |

Asian |

No |

4 |

4 |

P3 |

Female |

Asian |

Yes |

2 |

4 |

P4 |

Female |

White |

Yes |

5 |

5 |

P5 |

Female |

Black or African-American |

No |

4 |

5 |

P6 |

Female |

Asian |

No |

5 |

5 |

P7 |

Male |

White |

Yes |

1 |

5 |

Table 1. List of participants in the user study.

##

5. Findings

We present our findings, summarizing themes we discovered from our observations and participants’ responses, and present them within the framework of our design objectives: expressiveness, understandability, and integration.

###

5.1. Expressiveness

“Just [filtering and sorting] alone, you can do a million things with them” - P7

We found that Pilot helped participants express their feed customization preferences in different ways. By allowing users to use filters, sorting options, or a combination of both, we were able to support very different workflows that fit the user’s priorities.

On one extreme, P2 was most concerned with making sure they were not missing out on content they would want to see. As a result, they made little use of filters, preferring using the sorting options instead, since it afforded them more fine-grained control and was not “all-or-nothing.” This was valuable to P2 since they wanted to use their feeds to discover more content that they could not capture with just keywords.

On the other extreme, some participants (P5, P6) were more concerned with finding relevant content, and made little use of sorting options, making heavy use of “inclusion” filters instead to search for specific content. P6 felt the filters were the most helpful because the filter’s effects are ”binary,” in direct contrast to P2.

The remaining participants fell somewhere in-between, using a mix of filters and prioritization to achieve their goals.

Overall, participants felt that all the options were useful. P1 and P6 expressed that they would anticipate using all of the configuration options at some point, even if they use some features more often than others, and P6 additionally expressed that the complexity of having all the options available was not overwhelming. P7 stated that while the feature set was concise, they would not add much.

This study illustrate how even these simple controls open up a wide range of possibilities for the user.

Participants found the ability to create multiple feeds the be valuable as well. P4 felt it was valuable to be able to create feeds for separate roles, comparing it to separating one’s personal and professional life.

P7 would try to create a separate feed to every different topic they’re interested in to help them catch up with all of their interests. They indicated that they might also want to create another feed that combines their custom feeds into one.

####

5.1.1. Inclusion Filters

Participants would use inclusion filters when they had a specific topic they wanted to focus on. Inclusion filters would usually be added manually through the filter editor, and would often involve experimentation. For example, P4 set an inclusion filter of “education” to narrow down their general science feed to education related papers. They then added “student” as well to expand their results, and were able to discover new and relevant content. P5 went back and forth between browsing and adding specific designers and fashion related terms while customizing their feed. P7 added “sci-fi” as well as some variants such as “scifi” and “science fiction” to focus on a specific topic.

Less frequently, participants would select highlighted keywords to include. For example, while P6 was creating a news related feed, they came across a post about data science, and created an inclusion filter based on that to try to get more tech-related content. While P6 had stated that the implicit “or” relationship between inclusion filters was intuitive, P4 had expressed that this was not immediately clear.

####

5.1.2. Exclusion Filters

Participants had varied strategies for using exclusion filters to remove or reduce undesired content from their feed. One strategy involved finding words directly related to the topic they want to exclude. For example, P3 identified keywords “AI” or “GPT” to exclude content related to generative AI. P6 was looking for discussion around a particular game, and selected “hard” to try to exclude discussions about a game’s difficulty. Another strategy was to focus on authors who posted undesired content instead. P6 wanted to refine their book related feed to show more recommendations, so they excluded an author that was expressing a personal opinion irrelevant to P6’s goal. P4 identified and excluded an author who appeared to be untrustworthy. With either strategy, these actions would follow immediately after the participant encounters undesired content on their feed, and they would click on the highlighted keyword or author, then exclude them from the inline feedback editor.

####

5.1.3. Priority Sorting

While all participants experimented with priority sorting, P1 and P2 made the most use of the priority sorting feature. P1 found priority sorting helpful, as it allowed them to capture nuances such as being able to rank certain criteria over others, and P2 valued being able to adjust their feed in a way that was not too heavy-handed. Participants varied in how much they would adjust scores by. P2 only changed priorities in increments of ±1, as they were most concerned with not missing out on content, but P3, P4, and P7 were confident with using increments of 5 or more.

We had anticipated that participants would use sorting options as a way to surface relevant content. While some participants did, others did not. For example, P5 made little use of sorting when creating a feed of book recommendations, stating that it did not matter to them how things were sorted, they only cared whether or not the content was present. P6 stated that they preferred using the filters to search for content since they were easy to understand and it was harder to figure out how to use the priority sorting to get the posts to come to the top.

###

5.2. Understandability

Overall, participants expressed little difficulty in understanding the controls and what they did or how they worked. P6 felt that the use of using standard words (e.g. sorting, filter, chronological, sandbox) helped them understand what the customization options did, indicating that borrowing idioms from other applications can help accelerate the learning process for users. Several participants (P3, P4, P6) had moments where they did not know which feed a post came from, but source indicators could be an easy fix to this. Participants had little difficulty understanding how the filters worked, though some participants had trouble finding the right keywords to use. Additionally, while P6 had stated that the implicit “or” relationship between inclusion filters was intuitive, P4 had expressed that this was not immediately clear, though they were able to quickly figure this out after some experimentation.

Participants varied in how they learned to use the sorting options. P6 and P7 experimented with setting very high weights (50, 10000) on some keywords to see what effect it had.

P1 and P7 found breakdowns of the priority scores for each post were helpful for understanding exactly how priority was calculated, and how their configured sorting options were factoring into the calculation.

On the other hand, P3 and P6 expressed difficulty with figuring out how much to adjust priority by to achieve their goals.

In other cases, participants had trouble finding the right keywords to use. For example, P4 would see posts related to politics, but unable to find satisfactory keywords to reduce political content on their feed, would de-prioritize the authors instead. While P2 had faced a similar issue where they had trouble finding the right keywords to exclude undesired content, but felt that their alternative approach of increasing the priority of desirable content was an effective way to achieve a similar effect.

###

5.3. Integration

“Having everything highlight-able made for a good, easy, fun, user experience” - P7

We found that the inline feedback editor helped to make Pilot integrate well with the user workflow.

Participants primarily used the inline feedback system when they wanted to change customization options such as inclusion filters and sorting options.

P2 indicated that inline feedback feels more natural while browsing as it allowed them to continue browsing, while the standalone sandbox view would be used when more focused on configuration, such as when creating a new feed.

P1 found being able to click directly on the authors / keywords was helpful compared to creating things from scratch.

P7 felt that this even made the customization process enjoyable, and encouraged them to try playing with it more.

We found that sandbox button on the home screen helped to keep the controls accessible while being minimally intrusive.

P3, P6 expressed that it was valuable to have the option to not engage with the control interface and just browse.

P6 expressed that they would often use social media to relax and would not want to engage with controls while in this “mode.” However, they do appreciate having the option there as it gives them the choice when they want to customize vs. when they want to just browse, highlighting the importance of having controls accessible.

In contrast P5 stated that they would have the controls open all the time while browsing if it was available to them on Instagram or Tiktok. This is an indication to how well the controls blended with this participant’s browsing activities, but it also reflects a more active style of using the controls.

###

5.4. Perceptions of User Agency

All participants reported increased feelings of agency while using Pilot . We found that various aspects of our design contributed to users feeling of agency and their confidence in their ability to use the system.

P1 said that the transparency helped to make it feel like Pilot gave them a say in what they were seeing.

P2 said it makes them feel like they have more control over the feed, and increases their confidence in their ability to curate their feeds.

P2, P6, and P7 stated that the immediate feedback of seeing the feed update after changing some settings and seeing their changes clearly reflected in the feed encouraged them to keep using the tool, and helped to build up their confidence with using it.

Especially compared to other platforms they use, participants valued the increased agency.

P2 felt that while other platforms only give similar posts to what they have already seen, this tool allows them to get a greater diversity of content.

P3 valued how much easier the tool makes it to block keywords compared to what they have already on BlueSky on Twitter.

P6 said it was nice to directly tell the algorithm how to filter and sort, rather than hoping the algorithm will pick up on what they want.

P6 additionally said they valued having the agency to choose when they want to spend the extra effort to customize or simply browse the feed as is.

We also found that Pilot encouraged users to think more critically about the content on their feeds.

P3 said that it was their first time making their own feed, and that it helped them think more critically about curating their own feed.

P2 said that highlighted keywords lead them to read posts more carefully, and think more critically about feed composition, what makes posts more/less desirable, and how people write their posts.

The start of creating a new feed offered participants a chance to reflect on what kind of content they are interested in, and interacting with the controls helped them to refine their goals. For example, P3 and P7 both started considering what they might want to exclude while first setting up, before seeing any posts.

P5 felt that interacting with the filtering options helped them think more critically about the tradeoffs of having narrow, more focused feeds (e.g., based on whitelisted keywords) vs. the opportunity to discover new content.

###

5.5. Requested Features

During the course of the study, participants suggested several features that would expand their customization capabilities and improve their overall experience.

P3, P4, and P7 expressed a desire to add individual authors as sources.

A couple participants (P1, P5, P6) suggested support for a more image-oriented feed. P5 also mentioned they primarily browse pictures, and

P1 and P5 wanted to be able to filter the feed by media type, i.e., whether or not the post has an image, link, etc.

P7, when looking for sci-fi related content, added “sci-fi” as well as some variants such as “scifi” and “science fiction.” P4 suggested a way to add keywords and also add similar keywords automatically. P2 also suggested something that can suggest keywords for the user, but only when they are completely stuck, preferring manual control otherwise.

P7 suggested an option that allows someone to browse the whole network.

P6 expressed that sometimes they would value prioritizing by the age of a post when building a feed for time-sensitive content, such as news or current events. However, for feeds oriented around content that is less time-dependent, such as books, book recommendations, and art, they would not want age to be a factor in sorting, as it could downrank posts that have relevant content. This can be addressed by adding in options to configure how or if time is factored into priority scores.

##

6. Discussion

Based on our findings, we present implications for designing usable controls and feedback mechanisms on social media feeds. We also discuss broader implications of increasing user agency over personalized feeds on social media, then finally discuss limitations and avenues for future work.

###

6.1. Design Implications

####

6.1.1. Keeping things simple but expressive.

Although there were only three categories of options users had to customize their feeds (i.e., choosing sources, setting filters, setting priority weights), participants did not feel limited by this. In fact, participants were able to achieve a wide variety of goals using just these controls. And whenever participants felt like there was something they were unable to do with the system, their suggestions were related to broadening what they can do within sources, filters, and sorting, such as being able to add more kinds of sources, or something to help them make filters based on higher-level features not immediately obvious with keywords alone. While indeed, there are many ways to extend Pilot to give users more expressive controls, such as by using machine-learned classifiers to predict high-level features or topics of a post, we present the three categories of sources, filters, and sorting as a concise and easily understandable framework for designing expressive controls.

####

6.1.2. Designing highly-visible and easily discovered controls.

Ensuring that the controls are highly visible and easily discoverable is critical to an effective design. As P7 reported, while they were aware that BlueSky had feed customization options, since that was a core value of BlueSky as it was being built, they never engaged with any of those options, since it was not immediately obvious how they could. However, they felt that having the tools to create and modify feeds visible and easily accessible helped them to actually start thinking about making custom feeds.

“I know Bluesky has the capability to design your own feed that I haven’t looked into, which feels more invisible to me, so I haven’t gone through the process” (P7). This echoes prior research on how awareness of controls can be a barrier to its user (Hsu et al., 2020 ) . In our design of Pilot , we overcame this problem by placing the “sandbox” button at the top left of the home screen view to remind users at all times that they can customize the feed, and keep those options only one click away. Additionally, the button to make a new feed is one click away from the home screen, and from there, users can discover all of the remaining control with at most one click. Future designs should ensure that their controls are similarly easy to discover, with the most important controls being no more than a few clicks away.

####

6.1.3. Providing clear and immediate feedback.

We found that users valued the clear and immediate feedback of refreshing their feed, and seeing their customization actions be immediately and clearly reflected. The feedback was most immediate when participants used filters, especially inclusion filters, since it made drastic changes to the feed composition. With sorting, the feedback was more subtle, as participants would see that posts start appearing earlier or later, and that the calculation of its priority changed. We found that this helped boost their confidence, and encouraged them to continue using Pilot to customize their feeds. P7 even reported that it made the process more fun, and that it encouraged them to keep playing with Pilot to try to create a lot of different feeds for their interests and see what they can make. This feedback also helped users refine their goals and be more specific about the kind of feed they are building as they performed multiple iterations of customizing and reflecting on what they have so far.

On the other hand, our design was missing indicators to help users identify which source posts were coming from, which caused confusion when participants were adjusting sources. For example, as a glitch occured while P4 was adding sources they were confused as to why the feed composition did not change. In another example, P6 spotted a post in a language they could not read, and tried remove the source feed it likely came from, but when they saw no difference, they simply moved on.

This shows the importance of having clear and immediate feedback for all of the controls that the user can adjust.

####

6.1.4. Integrating controls into the Feed.

Unlike other feed customization tools on BlueSky (e.g. SkyFeed), we integrated Pilot ’s system of controls directly into the feed. This integration increased the visibility of the system, which was important on its own, as we discussed above. However, the ability for users to quickly change options by clicking on a highlighted author or keyword was important as well. This greatly reduced the friction of customizing the feed, whether the user is engaging in heavy customization such as when first creating a feed, or while they are browsing and refining the feed or changing the topic of their feed. Integrating into the feed also made it easier for user to get immediate feedback as the feed would update to reflect the changes they just made, and then continue browsing or customizing without ever leaving the feed. In addition, as Feng et al. ( 2024 ) had found, and as we saw in a few of our interviews, users may not always want to remain engaged with the controls. Using Pilot , participants found the ability to easily hide and open the controls effective as it allowed them to disengage with the controls and browse normally, while still maintaining a feeling of agency because the controls are easily accessible.

####

6.1.5. Supporting different priorities and approaches.

We found that participants had varied approaches and priorities when creating custom feeds. Thus it was important that Pilot was flexible enough, and support different approaches for customizing feeds to allow participants were able take the approach that made the most sense to them when customizing their feeds. For example, many participants felt that the filters were the easiest to understand how to use, some using filters almost exclusively and treating the custom feed like a search tool. Others were more concerned about the tradeoff of possibly missing content content they want to see, and was able to use priority sorting to take a more subtle approach.

Ensuring controls are easy to understand is an important part of supporting these different approaches.

While some participants reported that the breakdowns of how the priority was calculated for each posts was helpful for making the system more transparent and easier to understand, others had trouble understanding how to use the priority sorting options to surface relevant content. As a result, participants had faced some difficulty with their approach when perhaps a more effective approach was possible. For example, P5 and P6 would try to look for relevant content by using only inclusion filters, even when few matches were found. If the priority sorting mechanisms were easier to use, perhaps they may have found using those to a be a more effective way of identifying related terms they did not initially think of since relevant posts that did not use the exact keywords they had selected would not be excluded. These raise two interesting challenges for future design. One challenge is to try to make a better way of helping users understand how to use the priority sorting options, or designing a more intuitive way to support users who prefer taking more subtle actions to customize their feeds. The other challenge is preventing users from getting “stuck” using certain approaches, and leading them to try different, potentially more effective approaches.

####

6.1.6. Accounting for external factors.

Feng et al. ( 2024 ) had pointed out how external factors such as a user’s mood could affect their needs in a way that cannot be predicted from the users behavior on the feed itself. We had found that two features of Pilot were able to support this. First, allowing users to create multiple feeds. P4 makes the analogy to being able to separate one’s personal and professional life. P7 said they would try to create a feed for each of their interests so they can catch with each of them separately.

P3 had said that they currently achieve separation by having separate accounts, but being able to have a single system with multiple feeds reduces the “annoyance” of having to login/logout, and removes the need to worry about whether they are on the right account.

The ability to separate concerns through a multitude of feeds was thus an effective way of supporting users’ needs. However we also found that the filters helped participants satisfy their needs within a single feed by allowing to search for content they are interested in the moment. For example, P5 had stated they might use a system like Pilot on their usual platform, TikTok, and keep it open all the time, changing out filters to browse different topics they are interested in. The exact right approach may depend on the user and the platform, but allowing users to choose when they want to see what content is an effective way of accounting for external factors that influence a user’s preferences.

####

6.1.7. Building on decentralized platforms.

As major platforms continue to restrict access to their APIs and implement dark patterns to make controls more difficult to find, it becomes increasingly clear that these platforms are not going to welcome changes that give more control to users. However decentralized platforms offer a promising alternative. We had built Pilot on top of BlueSky, which is currently one of the most popular decentralized platforms. The web client and mobile applications for BlueSky are open source, which greatly facilitated our building our own client. The API to access post data and query other feeds is very easy to use with little restrictions, with no cost to use and a generous rate limit. This all makes it easy to make extensions to BlueSky just as we did without having to reverse engineer the code or worry about the terms of service, and makes it easy to maintain as well. It also allows for more natural user studies as there is no need to simulate a or mock any data since the system can connect to the rest of the network via the API. Most importantly, these extensions can eventually be deployed and be made available for widespread use by end-users, as many have already done. 2 2 2 https://docs.bsky.app/showcase

###

6.2. Increasing User Agency in Personalized Feeds

We found Pilot increased participants feelings of agency. Increasing user agency is important on social media platforms, even if personalized algorithms are “mostly accurate.” For example, P6 reported that they felt that while Instagram usually knows what they like, it can sometimes be off, and it would be nice to have fine grained controls to change its behavior directly instead of hoping the algorithm will pick up on what they want. But increasing user agency affects more than just the user’s feed.

Based on our findings, we discuss some broader impacts of increasing user agency on social media.

####

6.2.1. Decoupling customization and social interaction.

In current social media platforms, every social interaction is coupled with some change to the algorithm. Every time the user likes, comments on, or even just loads content, the algorithm will use that information to adjust what is shown to the user, leading users to adopt behaviors they would not otherwise, such as avoiding opening TikToks sent to them by their friends to prevent the algorithm from changing (Simpson et al., 2022 ) .

This coupling reduces user agency, and being able to separate customization from social interaction is valuable to users.

For example, P5 expressed how they valued being able to exclude certain authors from their feed without blocking and avoid “looking mean.” By decoupling customization actions from social actions with social implications, users are able to attend to both their own personal needs and their social needs. This decoupling can also make the social signals clearer, as it would reduce the ambiguity of whether someone liked your content because they actually liked it or because they were just trying to train the algorithm. It would also reduce friction for users who want to use just browse social media without worrying about how that will impact the algorithm.

Another benefit to decoupling the controls from other activities is that it gives users the agency to decide when they want to spend the cognitive effort of training or customizing their feed, and when they want to relax and browse. For example, P6 had expressed the fact that they do not want to have to think about customizing all the time, and it was nice to be able to disengage and just browse, echoing findings from Feng et al. ( 2024 ) . Even on platforms that learn from user behavior with few explicit controls, users may feel like they are unable to relax because they have to constantly be monitoring their actions so as not to influence the algorithm in an unwanted way (Simpson et al., 2022 ) .

####

6.2.2. Critical thinking with recommender systems.

Prior work by Harambam et al. ( 2019 ) has shown that people are concerned that recommender systems make them less likely to think critically and ask self-reflexive questions about what they content want to see, what their preferences are, and how they should consume content online. The authors suggest that activating people and supporting their autonomy may be crucial when designing recommender systems.

Indeed our study shows that giving users the opportunity to actively engage with the feed generation algorithm encouraged them to think more critically about the posts they see, and look for patterns they might be able to use to identity posts that are desirable or undesirable. We also saw that the start of creating a new feed offered participants a chance to reflect on what kind of content they are interested in, and interacting with the controls helped them to refine their goals.

###

6.3. Limitations and Future Work

Next, we discuss the limitations of this study and highlight directions for future work.

####

6.3.1. Expanding the User Study

Our findings are largely limited by the size and composition of the sample population. In particular, six out of seven participants are currently working in or are studying in STEM fields, of which five self-rated as highly familiar with programming and/or automation tools (4 or 5 on a 5-point Likert scale). P7 was the only participant in a non-STEM career, and while they showed a lot of enthusiasm about the system, it would be informative to see how much our findings carry over to a broader population of users.

####

6.3.2. Supporting Higher-Level Features with IMT

We presented a framework that provides users with a lot of different ways to customize their feeds through sources, filters, and sorting options. A natural extension is to allow users to use high-level features such as topic or sentiment when specifying filters and sorting options. An IMT framework could be applied to help users create and customize their own models. This would be helpful especially for helping users moderate their feeds, where each user has their own definition for common moderation adjectives like “toxic” or “hateful,” influenced by their own personal experiences and identity. But this would also be helpful for helping users find relevant content beyond what they could do with keywords alone. The model’s predictions for these features could be shown on the post itself, much like the breakdowns of each post’s priority scores in our design, providing users with clear feedback as well as an entry point for giving feedback to the models. This approach could also be helpful for expanding support for more image-oriented feeds as well.

####

6.3.3. Extension to Other Platforms

Several participants compared their experience with Pilot to their experience on other platforms and felt that their experience on those other platforms would be improved if they had a similar system of controls available to them. Each platform has a unique layout and support different user workflows, so each platform presents its own unique challenges for designing a system of controls that integrates into the users workflow.

##

7. Conclusion

In this work, we built Pilot to study how to design customizable feeds with a usable controls and feedback mechanisms. We showed that configurable sources , filters , and sorting is an effective framework for designing expressive and easily understood controls. We studied how integrating these controls directly into the feed helped to improve the usability of controls mechanisms, and encouraged users to customize their feeds. Although there is more work to done in order to restore user agency across social media platforms, our implementation of Pilot on BlueSky stands as a proof-of-concept for giving users meaningful control over their feeds on a real social media platform.

## References

(1)

Com ([n. d.])

[n. d.].

Composable Moderation.

Fea (2023)

2023.

Featured Community Project: Skyfeed | Bluesky.

Bajpai et al. (2022)

Tanvi Bajpai, Drshika Asher, Anwesa Goswami, and Eshwar Chandrasekharan. 2022.

Harmonizing the cacophony with mic: an affordance-aware framework for platform moderation.

Proceedings of the ACM on Human-Computer Interaction 6, CSCW2 (2022), 1–22.

Burrell et al. (2019)

Jenna Burrell, Zoe Kahn, Anne Jonas, and Daniel Griffin. 2019.

When Users Control the Algorithms: Values Expressed in Practices on Twitter.

Proc. ACM Hum.-Comput. Interact. 3, CSCW (Nov. 2019), 138:1–138:20.

Chan et al. (2024)

Jackie Chan, Charlotte Lambert, Frederick Choi, Stevie Chancellor, and Eshwar Chandrasekharan. 2024.

Understanding Community Resilience: Quantifying the Effects of Sudden Popularity via Algorithmic Curation.

Proceedings of the International AAAI Conference on Web and Social Media 18 (May 2024), 227–240.

Chandrasekharan et al. (2019)

Eshwar Chandrasekharan, Chaitrali Gandhi, Matthew Wortley Mustelier, and Eric Gilbert. 2019.

Crossmod: A cross-community learning-based system to assist reddit moderators.

Proceedings of the ACM on human-computer interaction 3, CSCW (2019), 1–30.

Chang et al. (2022)

Jonathan P Chang, Charlotte Schluger, and Cristian Danescu-Niculescu-Mizil. 2022.

Thread with caution: Proactively helping users assess and deescalate tension in their online discussions.

Proceedings of the ACM on human-computer interaction 6, CSCW2 (2022), 1–37.

Choi et al. (2023)

Frederick Choi, Tanvi Bajpai, Sowmya Pratipati, and Eshwar Chandrasekharan. 2023.

ConvEx: A Visual Conversation Exploration System for Discord Moderators.

Proceedings of the ACM on Human-Computer Interaction 7, CSCW2 (Sept. 2023), 1–30.

Choi et al. (2025)

Frederick Choi, Charlotte Lambert, Vinay Koshy, Sowmya Pratipati, Tue Do, and Eshwar Chandrasekharan. 2025.

Creator Hearts: Investigating the Impact Positive Signals from YouTube Creators in Shaping Comment Section Behavior. In Proceedings of the CHI Conference on Human Factors in Computing Systems (CHI ’25) . Association for Computing Machinery, Yokohoma, Japan.

DeVito et al. (2018)

Michael A. DeVito, Jeremy Birnholtz, Jeffery T. Hancock, Megan French, and Sunny Liu. 2018.

How People Form Folk Theories of Social Media Feeds and What It Means for How We Study Self-Presentation. In Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems (CHI ’18) . Association for Computing Machinery, New York, NY, USA, 1–12.

DeVito et al. (2017)

Michael A. DeVito, Darren Gergle, and Jeremy Birnholtz. 2017.

”Algorithms Ruin Everything”: #RIPTwitter, Folk Theories, and Resistance to Algorithmic Change in Social Media. In Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems (CHI ’17) . Association for Computing Machinery, New York, NY, USA, 3163–3174.

Eslami et al. (2016)

Motahhare Eslami, Karrie Karahalios, Christian Sandvig, Kristen Vaccaro, Aimee Rickman, Kevin Hamilton, and Alex Kirlik. 2016.

First I ”like” It, Then I Hide It: Folk Theories of Social Feeds. In Proceedings of the 2016 CHI Conference on Human Factors in Computing Systems (CHI ’16) . Association for Computing Machinery, New York, NY, USA, 2371–2382.

Eslami et al. (2015)

Motahhare Eslami, Aimee Rickman, Kristen Vaccaro, Amirhossein Aleyasen, Andy Vuong, Karrie Karahalios, Kevin Hamilton, and Christian Sandvig. 2015.

”I Always Assumed That I Wasn’t Really That Close to [Her]”: Reasoning about Invisible Algorithms in News Feeds. In Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems (CHI ’15) . Association for Computing Machinery, New York, NY, USA, 153–162.

Feng et al. (2024)

K. J. Kevin Feng, Xander Koo, Lawrence Tan, Amy Bruckman, David W. McDonald, and Amy X. Zhang. 2024.

Mapping the Design Space of Teachable Social Media Feed Experiences. In Proceedings of the CHI Conference on Human Factors in Computing Systems . ACM, Honolulu HI USA, 1–20.

Gran et al. (2021)

Anne-Britt Gran, Peter Booth, and Taina Bucher. 2021.

To Be or Not to Be Algorithm Aware: A Question of a New Digital Divide?

Information, Communication & Society 24, 12 (Sept. 2021), 1779–1796.

Harambam et al. (2019)

Jaron Harambam, Dimitrios Bountouridis, Mykola Makhortykh, and Joris van Hoboken. 2019.

Designing for the Better by Taking Users into Account: A Qualitative Evaluation of User Control Mechanisms in (News) Recommender Systems. In Proceedings of the 13th ACM Conference on Recommender Systems (RecSys ’19) . Association for Computing Machinery, New York, NY, USA, 69–77.

Harper et al. (2015)

F. Maxwell Harper, Funing Xu, Harmanpreet Kaur, Kyle Condiff, Shuo Chang, and Loren Terveen. 2015.

Putting Users in Control of Their Recommendations. In Proceedings of the 9th ACM Conference on Recommender Systems (RecSys ’15) . Association for Computing Machinery, New York, NY, USA, 3–10.

Harris (2019)

Tristan Harris. 2019.

How Technology Is Hijacking Your Mind — from a Former Insider.

He et al. (2016)

Chen He, Denis Parra, and Katrien Verbert. 2016.

Interactive Recommender Systems: A Survey of the State of the Art and Future Research Challenges and Opportunities.

Expert Systems with Applications 56 (Sept. 2016), 9–27.

Hsu et al. (2020)

Silas Hsu, Kristen Vaccaro, Yin Yue, Aimee Rickman, and Karrie Karahalios. 2020.

Awareness, Navigation, and Use of Feed Control Settings Online. In Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems (CHI ’20) . Association for Computing Machinery, New York, NY, USA, 1–13.

Huang et al. (2024)

Evey Jiaxin Huang, Abhraneel Sarma, Sohyeon Hwang, Eshwar Chandrasekharan, and Stevie Chancellor. 2024.

Opportunities, tensions, and challenges in computational approaches to addressing online harassment. In Proceedings of the 2024 ACM Designing Interactive Systems Conference . 1483–1498.

Im et al. (2020)

Jane Im, Sonali Tandon, Eshwar Chandrasekharan, Taylor Denby, and Eric Gilbert. 2020.

Synthesized Social Signals: Computationally-Derived Social Signals from Account Histories. In Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems . ACM, Honolulu HI USA, 1–12.

Jannach et al. (2017)

Dietmar Jannach, Sidra Naveed, and Michael Jugovac. 2017.

User Control in Recommender Systems: Overview and Interaction Challenges. In E-Commerce and Web Technologies , Derek Bridge and Heiner Stuckenschmidt (Eds.). Springer International Publishing, Cham, 21–33.

Jhaver et al. (2022)

Shagun Jhaver, Quan Ze Chen, Detlef Knauss, and Amy X. Zhang. 2022.

Designing Word Filter Tools for Creator-led Comment Moderation. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (CHI ’22) . Association for Computing Machinery, New York, NY, USA, 1–21.

Jhaver et al. (2023)

Shagun Jhaver, Alice Qian Zhang, Quan Ze Chen, Nikhila Natarajan, Ruotong Wang, and Amy X. Zhang. 2023.

Personalizing Content Moderation on Social Media: User Perspectives on Moderation Choices, Interface Design, and Labor.

Proc. ACM Hum.-Comput. Interact. 7, CSCW2 (Oct. 2023), 289:1–289:33.

Jiang et al. (2023)

Jialun Aaron Jiang, Peipei Nie, Jed R. Brubaker, and Casey Fiesler. 2023.

A Trade-off-centered Framework of Content Moderation.

ACM Trans. Comput.-Hum. Interact. 30, 1 (March 2023), 3:1–3:34.

Jiang et al. (2021)

Jialun Aaron Jiang, Morgan Klaus Scheuerman, Casey Fiesler, and Jed R. Brubaker. 2021.

Understanding International Perceptions of the Severity of Harmful Content Online.

PLOS ONE 16, 8 (Aug. 2021), e0256762.

Jin et al. (2017)

Yucheng Jin, Bruno De Lemos Ribeiro Pinto Cardoso, and Katrien Verbert. 2017.

How Do Different Levels of User Control Affect Cognitive Load and Acceptance of Recommendations?. In IntRS@ RecSys . 35–42.

Karizat et al. (2021)

Nadia Karizat, Dan Delmonaco, Motahhare Eslami, and Nazanin Andalibi. 2021.

Algorithmic Folk Theories and Identity: How TikTok Users Co-Produce Knowledge of Identity and Engage in Algorithmic Resistance.

Proc. ACM Hum.-Comput. Interact. 5, CSCW2 (Oct. 2021), 305:1–305:44.

Kleppmann et al. (2024)

Martin Kleppmann, Paul Frazee, Jake Gold, Jay Graber, Daniel Holmgren, Devin Ivy, Jeromy Johnson, Bryan Newbold, and Jaz Volpert. 2024.

Bluesky and the AT Protocol: Usable Decentralized Social Media.

arXiv:2402.03239 [cs]

König (2022)

Pascal D. König. 2022.

Challenges in Enabling User Control over Algorithm-Based Services.

AI & SOCIETY 39, 1 (Feb. 2022), 195–205.

Lambert et al. (2024)

Charlotte Lambert, Frederick Choi, and Eshwar Chandrasekharan. 2024.

”Positive Reinforcement Helps Breed Positive Behavior”: Moderator Perspectives on Encouraging Desirable Behavior.

Proc. ACM Hum.-Comput. Interact. 8, CSCW2 (Nov. 2024), 390:1–390:33.

Lambert et al. (2025)

Charlotte Lambert, Koustuv Saha, and Eshwar Chandrasekharan. 2025.

Does Positive Reinforcement Work?: A Quasi-Experimental Study of the Effects of Positive Feedback on Reddit. In Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (CHI ’25) . Association for Computing Machinery, New York, NY, USA, 1–16.

Lukoff et al. (2021)

Kai Lukoff, Ulrik Lyngs, Himanshu Zade, J. Vera Liao, James Choi, Kaiyue Fan, Sean A. Munson, and Alexis Hiniker. 2021.

How the Design of YouTube Influences User Sense of Agency. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (CHI ’21) . Association for Computing Machinery, New York, NY, USA, 1–17.

Narayanan (2023)

Arvind Narayanan. 2023.

Understanding Social Media Recommendation Algorithms.

Ng et al. (2020)

Felicia Ng, Jina Suh, and Gonzalo Ramos. 2020.

Understanding and Supporting Knowledge Decomposition for Machine Teaching. In Proceedings of the 2020 ACM Designing Interactive Systems Conference (DIS ’20) . Association for Computing Machinery, New York, NY, USA, 1183–1194.

Ramos et al. (2020)

Gonzalo Ramos, Christopher Meek, Patrice Simard, Jina Suh, and Soroush Ghorashi. 2020.

Interactive Machine Teaching: A Human-Centered Approach to Building Machine-Learned Models.

Human–Computer Interaction 35, 5-6 (Nov. 2020), 413–451.

Seering et al. (2024)

Joseph Seering, Manas Khadka, Nava Haghighi, Tanya Yang, Zachary Xi, and Michael Bernstein. 2024.

Chillbot: Content Moderation in the Backchannel.

Proc. ACM Hum.-Comput. Interact. 8, CSCW2 (Nov. 2024), 402:1–402:26.

Siles et al. (2020)

Ignacio Siles, Andrés Segura-Castillo, Ricardo Solís, and Mónica Sancho. 2020.

Folk Theories of Algorithmic Recommendations on Spotify: Enacting Data Assemblages in the Global South.

Big Data & Society 7, 1 (Jan. 2020), 2053951720923377.

Simard et al. (2017)

Patrice Y. Simard, Saleema Amershi, David M. Chickering, Alicia Edelman Pelton, Soroush Ghorashi, Christopher Meek, Gonzalo Ramos, Jina Suh, Johan Verwey, Mo Wang, and John Wernsing. 2017.

Machine Teaching: A New Paradigm for Building Machine Learning Systems.

arXiv:1707.06742 [cs]

Simpson et al. (2022)

Ellen Simpson, Andrew Hamann, and Bryan Semaan. 2022.

How to Tame ”Your” Algorithm: LGBTQ+ Users’ Domestication of TikTok.

Proc. ACM Hum.-Comput. Interact. 6, GROUP (Jan. 2022), 22:1–22:27.

Simpson and Semaan (2021)

Ellen Simpson and Bryan Semaan. 2021.

For You, or For”You”?: Everyday LGBTQ+ Encounters with TikTok.

Proceedings of the ACM on Human-Computer Interaction 4, CSCW3 (Jan. 2021), 1–34.

Smith (2021)

Ben Smith. 2021.

How TikTok Reads Your Mind.

The New York Times (Dec. 2021).

Team (2023)

The Bluesky Team. 2023.

Algorithmic Choice with Custom Feeds.

Vaccaro et al. (2018)

Kristen Vaccaro, Dylan Huang, Motahhare Eslami, Christian Sandvig, Kevin Hamilton, and Karrie Karahalios. 2018.

The Illusion of Control: Placebo Effects of Control Settings. In Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems (CHI ’18) . Association for Computing Machinery, New York, NY, USA, 1–13.

Wall et al. (2019)

Emily Wall, Soroush Ghorashi, and Gonzalo Ramos. 2019.

Using Expert Patterns in Assisted Interactive Machine Learning: A Study in Machine Teaching. In Human-Computer Interaction – INTERACT 2019 , David Lamas, Fernando Loizides, Lennart Nacke, Helen Petrie, Marco Winckler, and Panayiotis Zaphiris (Eds.). Springer International Publishing, Cham, 578–599.

Wang et al. (2025)

Leijie Wang, Kathryn Yurechko, Pranati Dani, Quan Ze Chen, and Amy X. Zhang. 2025.

End User Authoring of Personalized Content Classifiers: Comparing Example Labeling, Rule Writing, and LLM Prompting. In Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (CHI ’25) . Association for Computing Machinery, New York, NY, USA, 1–21.

Wang et al. (2024)

Stephanie Wang, Shengchun Huang, Alvin Zhou, and Danaë Metaxa. 2024.

Lower quantity, higher quality: Auditing news content and user perceptions on Twitter/X algorithmic versus chronological timelines.

Proceedings of the ACM on human-computer interaction 8, CSCW2 (2024), 1–25.

Wang and Diakopoulos (2021)

Yixue Wang and Nicholas Diakopoulos. 2021.

Highlighting High-quality Content as a Moderation Strategy: The Role of New York Times Picks in Comment Quality and Engagement.

ACM Transactions on Social Computing 4, 4 (Dec. 2021), 1–24.

Weld et al. (2022)

Galen Weld, Amy X. Zhang, and Tim Althoff. 2022.

What Makes Online Communities ‘Better’? Measuring Values, Consensus, and Conflict across Thousands of Subreddits.

Proceedings of the International AAAI Conference on Web and Social Media 16 (May 2022), 1121–1132.

Zhao et al. (2013)

Xiaoxue Zhao, Weinan Zhang, and Jun Wang. 2013.

Interactive Collaborative Filtering. In Proceedings of the 22nd ACM International Conference on Information & Knowledge Management (CIKM ’13) . Association for Computing Machinery, New York, NY, USA, 1411–1420.
