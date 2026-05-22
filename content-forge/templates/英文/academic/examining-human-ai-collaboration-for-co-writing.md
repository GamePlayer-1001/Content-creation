---
title: "Examining Human-AI Collaboration for Co-Writing Constructive Comments Online"
source: "ar5iv/arXiv"
url: "https://ar5iv.labs.arxiv.org/html/2411.03295"
author: "arXiv authors"
type: "academic_preprint"
language: "en"
template_kind: "academic_reference"
license_note: "Open full-text web source; saved locally for style-analysis reference."
---
# Examining Human-AI Collaboration for Co-Writing Constructive Comments Online

> Source: https://ar5iv.labs.arxiv.org/html/2411.03295

# Examining Human-AI Collaboration for Co-Writing Constructive Comments Online

Farhana Shahid

Cornell University Ithaca United States

fs468@cornell.edu

Maximilian Dittgen

Cornell University Ithaca United States

myd4@cornell.edu

Mor Naaman

Cornell Tech NYC United States

mor.naaman@cornell.edu

and

Aditya Vashistha

Cornell University Ithaca United States

adityav@cornell.edu

(2018)

Abstract.

This paper examines how large language models (LLMs) can help people write constructive comments in online debates on divisive social issues and whether the notions of constructiveness vary across cultures. Through controlled experiments with 600 participants from India and the US, who reviewed and wrote constructive comments on online threads on Islamophobia and homophobia, we found potential misalignment in how LLMs and humans perceive constructiveness in online comments. While the LLM was more likely to view dialectical comments as more constructive, participants favored comments that emphasized logic and facts more than the LLM did. Despite these differences, participants rated LLM-generated and human-AI co-written comments as significantly more constructive than those written independently by humans. Our analysis also revealed that LLM-generated and human-AI co-written comments exhibited more linguistic features associated with constructiveness compared to human-written comments on divisive topics. When participants used LLMs to refine their comments, the resulting comments were longer, more polite, positive, less toxic, and more readable, with added argumentative features that retained the original intent but occasionally lost nuances. Based on these findings, we discuss ethical and design considerations in using LLMs to facilitate constructive discourse online.

LLM, constructive disagreement, homophobia, Islamophobia

† † copyright: none † † journalyear: 2018 † † doi: XXXXXXX.XXXXXXX † † conference: Make sure to enter the correct

conference title from your rights confirmation emai; June 03–05,

2018; Woodstock, NY † † isbn: 978-1-4503-XXXX-X/18/06 † † ccs: Human-centered computing Empirical studies in HCI

##

1. Introduction

Most people use social media in good faith  (Rajadesingan et al . , 2021 ) , but often struggle to reach common ground during online debates  (Baughan et al . , 2021 ) . Online disagreements often lead to toxicity and personal attacks, and the lack of support for constructive dialogue discourages people from challenging problematic content  (Gurgun et al . , 2023 ; Shahid et al . , 2024a ) . This results in downstream harms, such as the disappearance of minority viewpoints  (Collier and Bear, 2012 ; Grevet et al . , 2014 ) and increased propagation of harmful content  (Shahid et al . , 2024b ) .

To suppress online conflict and encourage civil dialogue, most platforms rely on reactive measures such as content removal and banning offenders, which are not always effective in encouraging prosocial behaviors  (Seering et al . , 2017 ; Srinivasan et al . , 2019 ) . In response, HCI researchers have explored proactive strategies to promote healthy discourse, such as using social cues to highlight positive behavior  (Jhaver et al . , 2017 ; Rajadesingan et al . , 2021 ) , and introducing frictions  (Seering et al . , 2019 ; Katsaros et al . , 2022 ; Masrani et al . , 2023 ) and nudges  (Esau et al . , 2017 ; Taylor et al . , 2019 ; Bossens et al . , 2021 ; Park et al . , 2023 ) to discourage people from using offensive language. However, these interventions put the onus on users to write their opinions constructively,

which is already difficult in non-conflicting situations  (Cutler et al . , 2022 ) , and more so during disputes on socially divisive issues.

Researchers have defined constructive comments as those that balance argumentation with politeness  (Kolhatkar and Taboada, 2017a , b ; Kolhatkar et al . , 2020 ) . Given the challenges people face in engaging constructively in online arguments  (Gurgun et al . , 2023 ) ,

some researchers have trained large language models (LLMs) to help people in argumentative writing  (Lee et al . , 2022a ; Zhang et al . , 2023 ; Dang et al . , 2023 ) . While early evaluations show that these models improve people’s writing  (Zhang et al . , 2023 ) and help them find common ground on divisive issues  (Argyle et al . , 2023 ) , much of this work focuses on argumentative essay writing and one-on-one private debates. Moreover, these studies do not take into account how people from different cultures approach argumentation. Prior research shows that people from individualistic cultures prefer logical arguments that follow formal rules to substantiate points  (Nisbett et al . , 2001 ; Peng and Nisbett, 1999 ; Choi, 1988 ) . In contrast, those from collectivist cultures favor dialectical arguments during social conflicts, emphasizing a holistic consideration of different viewpoints and finding middle ground  (Ting-Toomey et al . , 1991 ; Ting-Toomey and Kurogi, 1998 ; Peng and Nisbett, 1999 ) . These cultural differences might prove critical while designing interventions to help people engage in online debates on divisive social issues, especially since LLMs tend to homogenize writing towards Western norms and diminish cultural nuances  (Agarwal et al . , 2024 ) .

We extend this growing body of work in two key ways. First, we examine how people perceive and write constructive comments on socially divisive issues within online threads, where meaningful discussions often get overshadowed by thoughtless and negative comments  (Napoles et al . , 2017 ) . Second, we investigate if notions of constructiveness in online debates vary across cultures. Specifically, we address the following research questions:

RQ1:

Do perceptions of constructive comments differ between humans and LLMs?

RQ2:

Can LLMs help people write constructive comments on divisive social issues?

RQ3:

Do notions of constructiveness in online comments vary across cultures?

To answer these questions, we conducted a two-phase study with participants from India and the United States of America (US), who reviewed online threads containing homophobic and Islamophobic content relevant to their cultural contexts. In Phase 1, we used GPT-4 to generate constructive comments on these threads, following either a logical or dialectical argumentation style, and adopting different stances (either in favor or against the issue). We verified, both quantitatively and qualitatively, that the LLM-generated comments differed only in argumentation style and not in linguistic features of constructiveness. We then conducted a forced-choice experiment with 103 Indian and American crowd workers on Prolific. Each participant reviewed either a homophobic or an Islamophobic thread along with randomly selected pairs of logical vs. dialectical comments, written for the same thread from the same stance. For each pair, participants indicated which comment they perceived as more constructive and why. To compare human and LLM’s perceptions of constructiveness, we also assigned the same task to GPT-4.

In response to RQ1 , we found that GPT-4 was 2.46 times more likely than humans to select dialectical comments as more constructive than logical ones. GPT-4 tended to prioritize comments that were polite and balanced different viewpoints (dialectical arguments). In contrast, our participants favored comments that emphasized logic and facts (logical arguments) more than GPT-4 while picking constructive comments. Given these differences, we next examined how people engage with LLMs when writing constructive comments.

In Phase 2, we conducted a between-subject experiment with 103 Indian and American crowd workers recruited through Prolific. Participants were asked to write constructive comments on homophobic and Islamophobic threads. They were randomly assigned to one of two groups: a control group where they wrote comments independently, and a test group where they could select prompts to request an LLM to rewrite their comments constructively. In the test group, participants had the flexibility to accept, edit, reject, or regenerate the suggestions from LLM.

To address RQ2 , we compared the comments from Phase 2— the ones participants wrote independently in control group (human-written) or with LLM’s assistance in test group (human-AI written)— alongside the comments generated solely by LLM (AI) in Phase 1 to assess which type of comment was more constructive. Crowd evaluation showed that, when presented with (Human vs. AI) comment pairs, participants were 8.51 times more likely to select LLM-generated comments as more constructive than the human-written comments. Similarly, participants were 3.19 times more likely to choose HAI-written comments as more constructive over human-written comments. Quantitative analyses of these comments revealed that both LLM-generated and HAI-written comments contained significantly more constructive features, such as greater length, more discourse connectives, and stance adverbials, than human-written comments. These suggest that LLMs have the potential to assist people in writing more constructive comments on divisive social issues.

We noted that when participants requested suggestions from the LLM, it made their comments significantly more positive, more constructive, and less toxic. In most cases, participants accepted the LLM’s suggestions because it conveyed their points better without homogenizing their writing. However, some participants felt that the LLM misrepresented their views and edited the suggestions in ways that made their comments more negative and toxic. Overall, participants were satisfied with the comments they wrote with the assistance of LLMs and found the process easier than writing constructive comments independently.

Finally, we compared the responses of Indian and American participants in Phase 1 and Phase 2 to address RQ3 . We found that participants from both countries considered dialectical comments as more constructive than logical ones and provided similar reasoning for their preferences. They showed comparable skill in writing constructive comments, both independently and with LLM assistance. In the test group, participants from both countries used similar prompts to make their comments constructive. Additionally, they also rated LLM-generated and HAI-written comments as significantly more constructive than the human-written comments. These findings suggest a shared understanding of constructiveness across cultures in the case of online comments on divisive social issues. Taken together, our work makes the following contributions:

We provide both quantitative and qualitative evidence that LLMs can help people from different cultures write constructive comments on divisive issues.

We uncover potential misalignment between human’s and LLM’s preferences for different argumentation styles while assessing constructiveness.

We reveal the potential risk of LLMs misrepresenting people’s views on divisive issues by applying positive sentiment to their comments.

We discuss both ethical and design consideration for developing socio-technical systems that promote constructive discourse on divisive issues across different cultures.

##

2. Related Work

We situate our work by outlining approaches to promote prosocial behaviors online and reviewing the potential of large language models (LLMs) in supporting users during online disagreements. We then discuss prior research on constructive discourse and cross-cultural variations in argumentation.

###

2.1. Promoting Prosocial Discourse Online

Design strategies to foster civil dialogue online range from static approaches like explicitly listing rules  (Kraut, 2012 ) to dynamic interventions. At the user level, features that provide contextual information, such as showing a list of high-performing community members  (Jhaver et al . , 2017 ) or shared interests among interlocutors  (Rajadesingan et al . , 2021 ) , encourage people to be polite. At the platform level, users favor options to switch the privacy setting of conversations from public to private when discussions become heated, expecting this would draw less attention to disagreement and enable civil exchanges  (Baughan et al . , 2021 ) . In Nextdoor, moving popular posts from public to private groups has led to more civil interactions and fewer comments that get flagged  (Kim et al . , 2022 ) .

Additionally, researchers have designed interventions to improve the quality of comments online. For example, research shows that highlighting toxicity during writing  (Warner et al . , 2024 ) and prompting people to consider their audience  (Park et al . , 2023 ) and recipients’ feelings  (Taylor et al . , 2019 ) result in more polite and empathetic comments. Providing specific questions  (Esau et al . , 2017 ) and discussion points  (Bossens et al . , 2021 ) during online debates helps people write civil and focused comments. Moreover, giving people positive stimuli  (Seering et al . , 2019 ) , nudging them to reflect before posting their comments  (Katsaros et al . , 2022 ) , and making people wait before letting them post comments  (Masrani et al . , 2023 ) also foster thoughtful and prosocial discussions. At the thread level, surfacing high-quality comments  (Berry and Taylor, 2017 ; Wang and Diakopoulos, 2022 ) , signaling existing tension within the conversation  (Chang et al . , 2022 ) , displaying key points from other people’s comments  (Kriplean et al . , 2012b ) , and pros and cons of different views expressed in the thread  (Kriplean et al . , 2012a ) have been shown to improve follow-up discussions.

While these interventions promote prosocial behaviors online, they do not guide

people on how to express their disagreements constructively . Research shows that people often prefer pre-written questions  (Gurgun et al . , 2023 ) and sentence openers  (Mcalister et al . , 2004 ) that help them challenge others constructively instead of having to write everything from scratch. In this context, recent advances in LLMs have opened up new avenues to support people in online argumentation, which we discuss now.

###

2.2. LLMs for Facilitating Online Argumentation

Several researchers have used LLMs as a mediator to improve online argumentation. For example, Govers et al . ( 2024 ) conducted an experiment with American participants, where people reviewed polarizing online threads containing comments both from public and LLM-based mediators. They found that highly cooperative and persuasive strategies deployed by mediator-bots could successfully change reader’ opinions on polarizing issues. Similarly, Tessler et al . ( 2024 ) fine-tuned an LLM to craft opinion statements on divisive political issues

and found that this approach can help small UK-based groups find common ground in democratic deliberation.

Apart from mediating discussions, LLMs have been used to provide users with actionable recommendations during writing. For instance, Zhang et al . ( 2023 ) designed a tool that helped writers visualize and integrate different elements of logical argumentation (i.e., claim, data, warrant, backing, qualifier, and rebuttal) in their writing. They evaluated the system among US college students, who found the tool helpful for writing argumentative essays. Ding et al . ( 2024 ) developed a learning tool for native English speakers in the US, which educated people about hate speech, brainstormed counter-speech strategies with them, and guided them to use empathetic tone while challenging hate speech. Participants reported that the system boosted their confidence to call out hate speech.

Similarly, Xia et al . ( 2022 ) designed an interactive visual system that highlighted which persuasive strategies (i.e., logos, pathos, ethos, and evidence) were either present or missing in users’ response, benefiting non-English speaking users in writing persuasive arguments in English. Argyle et al . ( 2023 ) conducted an experiment with American participants where an LLM suggested people to rephrase their message either by making it polite, restating opposition’s arguments, or validating opposition’s sentiment. They found that rephrasing users’ messages to signal respectful listening during one-on-one debates can improve perceived conversation quality, openness to hear opposing views, and participants’ sense of being understood. Kambhatla et al . ( 2024 ) curated human-written comments on controversial topics and reframed those comments using LLM to incorporate receptive elements, such as hedging, acknowledgment, elaboration, grounding, gratitude, or agreement. When shown to US participants, they found the LLM-rephrased versions more receptive to opposing views compared to the original comments.

While these studies employ diverse approaches to improving discussion on divisive issues, very few actually look into how to enable users to write their opinions constructively during online debates. The handful of studies investigating the role of LLMs in facilitating argumentative writing either focus on essays on a select topic  (Lee et al . , 2022a ; Zhang et al . , 2023 ; Dang et al . , 2023 ) , private one-on-one debates  (Argyle et al . , 2023 ) , or static learning environments  (Ding et al . , 2024 ) . These contexts are qualitatively different from responding to an online thread on divisive issues, which often draws hateful interactions from different users. Moreover, existing studies on LLM-based interventions predominantly focus on Western populations, leaving a significant gap in understanding how to facilitate constructive discourse in different cultures  (Shortall et al . , 2021 ) . This is particularly important because not only a majority of users of online platforms are in non-Western regions, but also because LLMs are known to prioritize Western norms and values  (Cao et al . , 2023 ; Johnson et al . , 2022 ) and homogenize writings towards Western styles  (Agarwal et al . , 2024 ) . To address this gap, we examine if LLMs can facilitate constructive discourse on divisive issues in different cultural settings. In doing so, we specifically focus on “constructiveness” , as online platforms routinely moderate and rank users’ comments based on constructiveness  (Diakopoulos and Naaman, 2011 ; Diakopoulos, 2015 ) and often explicitly guide users to be constructive  (Ludwig, 2014 ) . To this end, we build upon prior work on constructive discourse and cross-cultural differences in argumentation, which we discuss next.

###

2.3. Constructiveness in Online Discussion

Subjective Interpretation. The concept of constructiveness varies across different contexts. In case of student evaluation, peer reviews, and product reviews, constructive criticism is defined as those that are delivered respectfully and provide actionable feedback for improvement  (Fong et al . , 2016 ; Weaver et al . , 2022 ; Yan and Wang, 2018 ) . In cases of disagreement, constructive conflict resolution strategies involve showing cooperative attitudes and trust with conflicting parties  (Deutsch, 1994 ; Bächtiger and Parkinson, 2019 ) .

When it comes to online discussion, there are some added nuances. For example, Friess and Eilders ( 2015 ) articulated constructive deliberation as finding common ground and providing new solutions. Kolhatkar and Taboada ( 2017a ) conducted a survey, where people described constructive comments as “civil dialogue that are relevant, target specific points, and provide appropriate evidence.” Others have focused on outcomes to define constructive disagreements, such as whether the dispute is resolved  (De Kock and Vlachos, 2021 ) and improves the performance of team members  (Niculae and Danescu-Niculescu-Mizil, 2016 ) . While these definitions emphasize the subjective nature of what is considered constructive, researchers in Natural Language Processing (NLP) have tried to capture the linguistic features of constructiveness, as outlined below.

Linguistic Features. To detect constructive features, NLP researchers have analyzed online conversations from different sources—such as CNN  (Sukumaran et al . , 2011 ) , New York Times  (Sukumaran et al . , 2011 ; Kolhatkar and Taboada, 2017b ) , Yahoo News  (Napoles et al . , 2017 ; Kolhatkar and Taboada, 2017a ) , online games  (Niculae and Danescu-Niculescu-Mizil, 2016 ) , and Wikipedia  (Zhang et al . , 2018 ; De Kock and Vlachos, 2021 ) —and relied on human evaluations to annotate these conversations along different dimensions, such as tone, level of agreement, and constructiveness. They also used quantitative methods to extract different linguistic features (e.g., toxicity, politeness) from these conversations, and used statistical modeling to identify significant predictors of constructiveness.

Findings from NLP researchers show that constructive comments tend to be more issue-relevant (Sukumaran et al . , 2011 ) and contribute to the main points in the conversation  (Kolhatkar and Taboada, 2017b ) . They are usually longer in length and take longer to write  (Sukumaran et al . , 2011 ; Kolhatkar and Taboada, 2017b ) . Constructive comments are more likely to show disagreement and thus, contain less hedging (less hesitation) and matched language (less subordinate)  (Niculae and Danescu-Niculescu-Mizil, 2016 ; Napoles et al . , 2017 ; De Kock et al . , 2022 ) . They are more likely to contain argumentative features, such as discourse connectives, stance adverbials, reasoning verbs and modals, and root clauses  (Kolhatkar and Taboada, 2017a ; Napoles et al . , 2017 ) . Additionally, respectful attitude and different politeness strategies, such as gratitude, greetings, requests, and deference are often observed in constructive discourse  (Napoles et al . , 2017 ; Zhang et al . , 2018 ; De Kock and Vlachos, 2021 ) . Readability scores, presence of solutions, evidence, personal stories  (Kolhatkar and Taboada, 2017b ) , and named entities  (Kolhatkar et al . , 2020 ; Niculae and Danescu-Niculescu-Mizil, 2016 ) are also indicative of constructiveness.

These findings suggest that constructive discourse requires balancing argumentation with politeness to express disagreements assertively, without appearing hesitant or subordinate. However, these features are mostly derived from discussions in Western media outlets and the quality of comments (e.g., respectfulness, reasoning) on online news websites vary a lot depending on the country’s attitude towards deliberation  (Ruiz et al . , 2011 ) . Therefore, we look into the cross-cultural differences in how people approach argumentation during social conflicts, which we discuss next.

###

2.4. Cross-Cultural Differences In Argumentation

Research shows that argumentation styles differ across individualistic (e.g., Western countries) and collectivist cultures (e.g., Asian countries). People from collectivist cultures like China  (Xie et al . , 2015 ) and India  (Hample and Anagondahalli, 2015 ) view arguments as less civil and more personal, and feel persecuted during interpersonal disagreements. Due to high power distance within such cultures, people are either more likely to avoid dissent or approach it strategically compared to their American counterparts  (Kapoor et al . , 2003 ; Croucher et al . , 2009 ) . They tend to be more polite, indirect, and express their opinions in a moderate and compromising way than Americans

during conflicts  (Ting-Toomey et al . , 1991 ; Peng and Nisbett, 1999 ; Norenzayan et al . , 2002 ; Suzuki, 2010 ; Hill et al . , 1986 ; Holtgraves and Joong-Nam, 1990 ) . They usually opt for dialectical argumentation, i.e., they are more receptive to opposing views  (Peng and Nisbett, 1999 ; Peng, 1997 ) . They holistically consider the relations among different perspectives and are more willing to compromise to achieve a middle ground to avoid confrontation  (Peng and Nisbett, 1999 ; Nisbett et al . , 2001 ; Choi et al . , 2007 ) .

In contrast, people from individualistic cultures like Europeans and Americans usually prefer formal, rule-based, and logical reasoning in their argument  (Norenzayan et al . , 2000 , 2002 ) . Research shows that argumentative essays written by Americans usually follow a linear pattern, where each claim is followed by supporting ideas and concluding units  (Choi, 1988 ) . When faced with contradiction, Europeans and Americans typically gravitate towards polarizing views in an effort to determine which fact or position is correct  (Peng and Nisbett, 1999 ; Nisbett et al . , 2001 ) . They appear more direct, assertive, solution-oriented, and dominating during interpersonal conflicts than people in collectivist cultures  (Ting-Toomey et al . , 1991 ; Ting-Toomey and Kurogi, 1998 ) .

Together, these findings show that there are significant cross-cultural differences in how people approach argumentation. Although argumentative features are strongly associated with constructiveness, there is no systematic study investigating constructive discourse across cultures. To address this gap and considering the support people need to express their opinions constructively, we conducted a study with participants from India and the US to examine if LLMs could help them write constructive comments in response to online threads on divisive issues.

Given argumentation styles vary across cultures  (Nisbett et al . , 2001 ) and LLMs are often biased towards Western values  (Cao et al . , 2023 ; Johnson et al . , 2022 ) , we first investigate whether humans and LLMs perceive constructive comments differently based on argumentation style (logical vs. dialectical) (RQ1). We then examine if LLMs can help people write more constructive comments on socially divisive issues online (RQ2). Lastly, we examine cross-cultural differences in how Indian and American participants perceive and write constructive comments on socially divisive issues (RQ3).

##

3. Methods

To address our research questions, we conducted a two-phase study with participants from both individualistic (e.g., the US) and collectivist cultures (e.g., India). In the first phase, we captured people’s perceptions of constructive comments on socially divisive issues online. In the second phase, we asked people to write constructive comments on socially divisive issues online. The study received exemption from institutional review board (IRB) at our institution.

###

3.1. Phase 1: Perceptions of Constructive Comments

Since prior research indicates that people from individualistic cultures prefer logical arguments, while those from collectivist cultures favor dialectical arguments, we examined in Phase 1 if the perception of constructiveness varies depending on the argumentation style.

Selection of Topics and Online Threads. For our study, we selected Reddit threads related to homophobia and Islamophobia as these issues are considered socially divisive topics in both the US and India. For each country, we curated two homophobic and two Islamophobic threads (see Table 11 in Appendix), each consisting of the original post and four user comments from relevant subreddits. The threads for American participants were drawn from r/conservative, r/politics, r/atheism, and r/changemyview and all the threads for Indian participants were sourced from r/IndiaSpeaks. All threads were in English and 78% of comments on these threads were negative in sentiment (average: -0.63) and included several highly negative and toxic comments.

Generating Constructive Comments with Different Argumentation Styles. Next, we used GPT-4 to generate constructive comments on the selected threads for each country. Since homophobia and Islamophobia are divisive issues, we wanted to take into account participants’ personal stance on these topics when they would evaluate constructiveness. We thus generated comments for two different stances— { against , supportive } against supportive \{\mathrm{against,supportive}\} —because these capture the two definitive and opposing views of people when they engage with such divisive topics. Considering the cultural orientation, we generated constructive comments following two different argumentation styles: { logical , dialectical } logical dialectical \{\mathrm{logical,dialectical}\} . In total, we generated comments for 2 cultural contexts { India , US } India US \mathrm{\{India,US\}} × \times 2 issues { homophobia , Islamophobia } homophobia Islamophobia \mathrm{\{homophobia,Islamophobia\}} × \times 2 threads × \times 2 stances { against , support } against support \mathrm{\{against,support\}} × \times 2 argumentation styles { logical , dialectical } logical dialectical \mathrm{\{logical,dialectical\}} = 32 different cases.

To ensure that participants’ responses are not sensitive to particular wordings, we generated three different comments for each case, resulting in 32 × 3 = 96 32 3 96 32\times 3=96 comments in total (48 for the US, 48 for India). We used zero-shot, cultural prompting (i.e., specified the country) to increase cultural alignment in LLM-generated comments for both countries  (Tao et al . , 2024 ) . We instructed GPT-4 to keep the comments within 100 words, which is the average length of constructive comments as observed in prior study  (Kolhatkar and Taboada, 2017b ) . Table  1 shows examples of constructive comments generated by LLM with different argumentation styles, and Table 12 in the Appendix shows details on the prompts used to generate constructive comments.

Table 1 . Examples of LLM-generated constructive comments with different argumentation styles.

Logical argumentation |

Dialectical argumentation |

Demographic: India |

Topic: Homophobia |

Stance: Supports |

same-sex marriage |

Seriously, comparing humans to animals for |

justifying homophobia? Humans do a lot of |

things animals don’t. Ever seen a lion drive |

a car or use the internet? Also, love isn’t |

exclusive to opposite sexes. It’s about |

connection, not reproduction. Secondly, |

being gay isn’t contagious! You can’t ‘turn’ |

a kid gay. Furthermore, embracing all forms |

of love isn’t ‘anti-traditional’. Traditions |

evolve over time. Lastly, the ‘natural law’ |

argument is weak sauce - homosexuality is |

observed in hundreds of species. Let’s stop |

dehumanizing LGBTQ folks and respect |

their rights. |

I respect every perspective, but it’s significant |

to understand that the crux of marriage is not |

just procreation but love, commitment, and |

companionship. Marriage, whether |

heterosexual or homosexual, should be about |

emotional bonding. As for preserving tradition, |

culture is not a static entity but evolves with |

time and society’s progress. Lastly, equating |

human relationships with animal behaviour |

isn’t a sound comparison. Change is inevitable, |

and accepting love in its various forms can lead |

to a more inclusive, empathetic society. |

Remember, rights granted don’t mean rights |

imposed. |

Demographic: US |

Topic: Islamophobia |

Stance: Against |

Islam |

Surely, radical Islam is an abhorrent brand |

of extremism with unjustifiable views |

towards women, apostates, and non-Muslims. |

But here’s the thing; equating all Islam with |

its extremist element is fundamentally flawed |

logic. It’s a gross generalization fallacy - akin |

to claiming all Americans support police |

brutality because some do. Moreover, it’s |

unjust to demonize an entire religion for the |

actions of a fraction of its followers. Thus, |

while there are valid reasons to condemn |

Islamic extremism, blanketing all Muslims |

under that banner is neither fair nor accurate. |

While it’s vital to critique oppressive practices |

like forced conversions and gender inequality, |

painting all Muslims with the same brush is |

harmful and inaccurate. Yes, extremism exists |

in Islam, as it does in many other religions and |

ideologies. However, attributing these acts to |

an entire faith hampers meaningful dialogue and |

understanding. It’s crucial to distinguish between |

extremists who misuse religion for personal gain |

and the vast majority of peaceful practitioners. |

Let’s continue to oppose extremism but avoid |

blanket statements that oversimplify complex |

issues. |

Validating Argumentation Style.

To ensure that LLM-generated comments indeed followed logical or dialectical argumentation styles, we conducted a validation study with 230 crowd workers from MTurk in India and the US. We first asked annotators about their views on same-sex marriage and Islam, using adapted instruments from Pew research survey  (Borelli, 2022 ; Center, 2017 ) . Then, we showed them either one randomly selected homophobic or Islamophobic thread, along with four randomly selected LLM-generated comments written for that thread. We only showed them comments that aligned with their stance on homophobia or Islamophobia, to account for biases from annotators’ personal opinions on these issues. For annotators, who reported feeling neutral about the issues, we randomly showed them comments that either supported or opposed the issue.

We asked participants to annotate if a given comment followed logical step-by-step arguments (logical) or holistically considered different viewpoints and took a middle-ground (dialectical). Each annotator reviewed four comments and received $ 1.00 currency-dollar 1.00 \$1.00 as compensation.

Once we gathered at least five annotations for each comment, we examined the agreement in annotations. For comments that were labeled incorrectly or where the annotators did not reach agreement, we generated new comments and repeated the process. We continued this process until we had at least two comments for each of the 32 cases, where the majority annotation matched the actual labels (See Table 2 ). In the end, we finalized 64 comments (US: 32, India: 32), where the argumentation styles in the LLM-generated comments were validated by human annotators.

Table 2 . Validation of the argumentation styles in LLM-generated comments.

Country |

Number of |

annotators |

Number of annotated |

comments |

Number of final comments where |

majority annotation matched true label |

Annotations per |

final comment |

US |

142 |

66 |

39 |

Avg: 7.5 (SD: 3.6) |

India |

88 |

57 |

32 |

Avg: 5.9 (SD: 2) |

Validating Level of Constructiveness.

To verify if LLM-generated comments differed beyond their argumentation styles, we analyzed the key linguistic features of constructiveness as reported in prior work  (Kolhatkar and Taboada, 2017b ; Napoles et al . , 2017 ; Zhang et al . , 2018 ) . These are: comment length, readability score, presence of politeness strategies, named entities, and argumentative features, such as discourse connectives, stance adverbials, reasoning verbs and modals, and root clauses (see Table  3 ).

Table 3 . Linguistic features of constructiveness as reported in prior work  (Kolhatkar and Taboada, 2017b ; Napoles et al . , 2017 ; Zhang et al . , 2018 )

Features |

Association with constructiveness |

Length |

Longer in length |

Readability score |

High levels of readability |

Politeness |

Respectful and uses different politeness strategies |

Named entities |

Contains named entities |

Argumentative |

features |

Greater presence of |

1. discourse connectives (e.g., therefore, due to) |

2. stance adverbials (e.g., of course, undoubtedly) |

3. reasoning verbs (e.g., cause, lead, ) |

and modals (e.g., may, should) |

4. root clauses (e.g., I think that) |

We used word count as a measure of comment length. We calculated readability scores using SMOG index ( textstat library in Python) as reported in Park et al . ( 2023 ) . To detect politeness strategies, we used politeness package from R  (Yeomans et al . , 2018 ) . We used spaCy to detect named entities in comments. For argumentative features, we used GPT-4 to identify how frequently each feature appeared in the comments. Due to statistical variability of LLM-generated responses, we measured each argumentative characteristic five times and used the average value.

Next, we analyzed if LLM-generated logical and dialectical comments differ from each other in any of the linguistic features and found no significant differences, suggesting that these comments differed from each other only in their argumentation style.

RQ1: Capturing Perceptions of Constructiveness.

To examine if the notions of constructiveness differ between humans and LLM (RQ1), we conducted a forced-choice experiment with 103 crowd workers from Prolific (US: 51, India: 52). In the experiment, participants were given a randomly selected homophobic or Islamophobic thread. The comments in the thread appeared in random order with redacted user names and profile photos (see Figure  6 in the Appendix). Given the toxicity in these threads, we warned participants that they might get exposed to negative comments before they accepted the task and gave them the option to quit the study at any point if they felt uncomfortable engaging with such content.

The participants were then presented with four pairs of randomly chosen comments where each pair contained an LLM-generated logical and a dialectical comment for the same thread. Each participant saw each comment in only one pair, and the order of comments within each pair was randomized. Among the four pairs, two consisted of comments opposing the issue, while the other two pairs consisted of comments supporting the issue. This way, participants were exposed to comments that did not align with their personal stances, as is common in online platforms. Since both comments within a pair shared the same stance, participants were not biased toward selecting the comment that matched their views.

We then asked participants to indicate which comment they perceived as more constructive in each pair and why. We gave them several options adapted from the characteristics of constructive comments and different argumentation styles as described in the literature  (Sukumaran et al . , 2011 ; Kolhatkar and Taboada, 2017b ; Ting-Toomey et al . , 1991 ; Ting-Toomey and Kurogi, 1998 ) . These characteristics were also consistent with open-ended explanations that participants provided in a small pilot (US: 27, India: 22) preceding the main experiment:

More relevant to the original conversation

Uses better logic and facts to support arguments

Balances different viewpoints better

Uses more polite and respectful language

Other (please describe):

We then repeated the same process with GPT-4. Participants in India and the US reviewed threads that were relevant to their cultural contexts, while GPT-4 reviewed threads from both countries.

Table  4 shows the demographic details of the participants. In total, 103 people participated in the study. We removed responses from four participants, who failed the attention check. Participants received $ 1 currency-dollar 1 \$1 for completing the task. We conducted multiple Chi-square tests with Bonferroni corrections to analyze the responses from both participants and GPT-4 to see whether their perceptions of constructiveness differ or not.

Table 4 . Demographic details of participants evaluating constructive comments in Phase 1.

Demographic (n) |

Age (years) |

Gender |

Views on same-sex marriage |

Views on Islam |

US (n=50) |

43.92 (SD: 11.68) |

Female: 48% |

Male: 52% |

Against: 29% |

Neutral: 8% |

Support: 63% |

Against: 31% |

Neutral: 27% |

Support: 42% |

India (n=49) |

29.08 (SD: 8.75) |

Female: 44% |

Male: 56% |

Against: 29% |

Neutral: 25% |

Support: 46% |

Against: 60% |

Neutral: 12% |

Support: 28% |

###

3.2. Phase 2: Writing Constructive Comments

We next examined if LLMs could help Indian and American participants write constructive comments on divisive social issues, such as homophobia and Islamophobia.

Writing Task. We designed a between-subjects experiment where participants were randomly assigned to either a control or test group. Within each group, participants were first asked about their views on same-sex marriage and Islam (using the same instrument from Phase 1). Then they were shown one randomly selected homophobic and one Islamophobic thread relevant to their cultural contexts. We randomized the order of the threads and asked participants to write a constructive comment for each thread. Since constructive comments tend to be longer  (Sukumaran et al . , 2011 ; Kolhatkar and Taboada, 2017b ) , we asked the participants to write a comment that is at least 50 words long. We also disabled copy-paste so that participants could not look up the threads online and submit copied responses.

In the control group , participants were asked to write constructive comments on their own without external assistance (e.g., the Internet or ChatGPT). In the test group , we instructed participants to write an initial draft before requesting help from an LLM (GPT-4) (see Figure  1 ). Once they wrote a draft, they could select from a list of prompts or provide custom prompt for the LLM to rewrite their comment constructively. The prompts were created to reflect characteristics of constructive comments and logical and dialectical argumentation, as described in prior work  (Sukumaran et al . , 2011 ; Kolhatkar and Taboada, 2017b ; Ting-Toomey et al . , 1991 ; Ting-Toomey and Kurogi, 1998 ) :

Make my comment relevant to the conversation

Use logic and facts to make step-by-step argument

Present solutions to address the issue

Balance contrasting views and take middle ground

Use polite and respectful tone

Other (write your own prompt):

Figure 1 . The interface for co-writing constructive comments with AI (LLM) in the test group. Participants first wrote their comment in the User Input box. They could select one or more prompts from the AI Interface to make their comments constructive. GPT-4 then rewrote participant’s comment in real-time, which would appear in the AI Suggestion box. Participants needed to either accept, reject, regenerate, or edit AI’s suggestion before submitting their final comment or prompting AI again. They could repeat the process as many times as needed before submitting their final comment. The example shown is based on a comment written by an American participant in response to an Islamophobic thread.

\Description

User Input: ”Comparing one religion to another is absurd, no two religions are alike because each one has their own beliefs or methods of doing anything. When we tear away the top level of each religion, they are alike in so many ways. Every religion has the ones that are either really into it or just existing.”

User selected: ”Use polite and respectful tone” to make my comment constructive.

User received suggestion from AI: ”It’s worth noting that each religion, while unique in its beliefs and practices, shares many commonalities beneath the surface. It’s not entirely accurate or fair to compare them directly. Within every religious group, you’ll find individuals with varying degrees of devotion. Let’s acknowledge these differences and similarities respectfully.”

We randomized the order of the prompts to avoid primacy and recency bias. To ensure that participants in the test group used LLM while writing constructive comments, they were required to prompt the LLM at least once before completing the writing task. Furthermore, participants had to write at least 20 words before requesting suggestions from the LLM to ensure that these comments were indeed generated via human-AI (HAI) collaboration. We used GPT-4 to rewrite participant’s comment on the given thread in real-time using the following prompt:

Consider the following Reddit thread:

¡insert thread¿

An ¡Indian, American¿ participant, who think ¡insert stance¿ of ¡homophobia, Islamophobia¿ wrote the following comment in response to the above thread.

¡insert participant’s comment¿

Make the comment constructive using following prompts.

¡insert prompts selected by the participant¿

After receiving the suggestion from the underlying LLM, participants could either accept, reject, regenerate, or edit the comment before they could use another prompt. Once participants were satisfied with the final output, they could submit it to finish the task.

Post-Writing Survey. Prior study shows that the ease of writing with LLMs often diminishes the sense of ownership people feel with their writing  (Kim et al . , 2023 ) . Therefore, after finishing the writing task, participants in both groups were asked to reflect how much ownership and satisfaction they felt with the final comments on a 5-point Likert scale. They were also asked to rate the difficulty of writing constructive comments. In addition, participants in the test group were shown one

LLM-generated suggestion that they either accepted, rejected, regenerated, or edited and were asked

the reason behind their action.

Participant Recruitment. To complete the writing task, we recruited 52 Indian and 52 American crowd workers from Prolific, who did not take part in Phase 1. Table  5 shows the demographic details of the participants.

We compensated participants with $ 1.70 currency-dollar 1.70 \$1.70 for completing the writing task. Overall, we collected 104 human-written comments from the control group and 102 human-AI (HAI) written comments from the test group.

Table 5 . Demographic details of participants, who completed the writing task in Phase 2.

Demographic (n) |

Age (years) |

Gender |

Views on same-sex marriage |

Views on Islam |

US (n=52) |

38.79 (SD: 13.19) |

Female: 60% |

Male: 38% |

Transgender: 2% |

Against: 15% |

Neutral: 10% |

Support: 75% |

Against: 23% |

Neutral: 29% |

Support: 48% |

India (n=51) |

28.63 (SD: 7.88) |

Female: 27% |

Male: 73% |

Against: 43% |

Neutral: 22% |

Support: 35% |

Against: 45% |

Neutral: 8% |

Support: 47% |

Human Evaluation of Constructiveness.

We next conducted a survey to examine which type of comment people perceived as more constructive: those written by humans (control group), human-AI (HAI) collaboration (test group), or solely generated by LLM (Phase 1).

We recruited 82 Indian and 82 American crowd workers from Prolific, who had not participated in both Phase 1 and the writing task in Phase 2. Each participant was shown a randomly chosen homophobic or Islamophobic thread related to their cultural context. Then, they were asked to review four pairs of randomly chosen comments

that were written for the same thread from the same stance. Each pair could either include (HAI vs. Human), (Human vs. AI), or (HAI vs. AI) comments.

Each participant saw each comment only in one pair and we randomized the order of comments within each pair. We asked participants to select which comment they perceived as more constructive within each pair. We ensured that each comment was reviewed by at least three participants. Since the number of human-written, HAI-written, and LLM-generated comments varied for the same thread and same stance, some participants might have reviewed certain types of pairs more than once. In total, we received 727 human evaluations from 157 participants after discarding responses from 7 participants, who failed the attention check. Participants were compensated with $ 1.00 currency-dollar 1.00 \$1.00 for completing the task.

Quantitative Analysis.

Next, we analyzed the key linguistic features of constructiveness (see Table  3 ) in comments written by humans (control) and those via human-AI collaboration (test). We followed the same procedure as in Phase 1 where we detected these features in LLM-generated comments.

For the test group, we also analyzed how incorporating LLM’s suggestions impacted the quality of comments by comparing participants’ initial drafts with their final submissions. Specifically, we compared the linguistic features of constructiveness, sentiment, and toxicity between initial and final comments. To analyze sentiment, we used VADER sentiment analysis tool as it is attuned to sentiments expressed in social media  (Hutto and Gilbert, 2014 ) . To detect toxicity, we used Google’s Perspective API. We also calculated cosine similarity, semantic similarity, and BERTScore  (Zhang et al . , 2019 ) between these pairs of comments. For cosine similarity, we used CountVectorizer from scikit-learn 1 1 1 https://scikit-learn.org/1.5/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html . For semantic similarity, we used all-MiniLM-L6-v2 sentence transformer 2 2 2 https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2 from Hugging Face. For BERTScore, we used contextual embeddings in BERT model 3 3 3 https://huggingface.co/docs/transformers/en/model_doc/bert from Hugging Face.

##

4. Findings

We first describe results from Phase 1 to answer how perceptions of constructiveness vary between humans and LLMs (Section 4.1 ). We then present our analyses of the comments participants wrote in Phase 2 to examine if an LLM could help people write constructive comments on divisive social issues (Section 4.2 ). Finally, we compare the responses from Indian and American participants in both Phase 1 and Phase 2 to examine cross-cultural differences in constructiveness (Section 4.3 ).

###

4.1. RQ1: Do Perceptions of Constructiveness Differ Between Humans and LLMs?

Perceptions of Constructiveness. In Phase 1, participants reviewed 396 pairs of logical and dialectical comments, and GPT-4 reviewed 454 such pairs. Binomial tests revealed that both participants and GPT-4 preferred dialectical comments way more than logical comments, which significantly differed ( p < 0.000001 𝑝 0.000001 p<0.000001 ) from the hypothesized proportion (50%). GPT-4 selected dialectical comments as more constructive than logical ones in 84% of cases (see Figure  2 A). In comparison, participants reported dialectical comments as more constructive in 68% of cases.

A chi-square test with Yates’ continuity correction revealed significant difference in the perception of constructiveness based on argumentation style between humans and GPT-4 ( χ 2 ​ ( 1 , N = 850 ) = 28.52 , p < 0.00001 , ϕ = 0.18 formulae-sequence superscript 𝜒 2

- 1 𝑁 850 28.52 formulae-sequence 𝑝 0.00001 italic-ϕ 0.18 \chi^{2}(1,N=850)=28.52,p<0.00001,\phi=0.18 , odds ratio=2.46), with a small effect size. GPT-4’s perception of constructiveness also differed significantly from that of both American and Indian participants who viewed dialectical comments as more constructive in 73% and 65% of cases, respectively.

Figure 2 . (A) Perceptions of constructive comments between humans and LLM based on argumentation style. (B) Perceived characteristics of constructive comments reported by both humans and LLM. Statistically significant differences are reported at p < 0.00001 𝑝 0.00001 p<0.00001 (****), p < 0.0001 𝑝 0.0001 p<0.0001 (***), p < 0.001 𝑝 0.001 p<0.001 (**), and p < 0.01 𝑝 0.01 p<0.01 (*) [adjusted P-values after Bonferroni correction].

\Description

(A) A bar chart showing LLM considered dialectical comments as more constructive than logical comments 84% time, whereas humans considered dialectical comments as more constructive 68% time. (B) A bar chart showing the distribution of perceived characteristics of constructive comments by humans and LLM.

Perceived Characteristics of Constructiveness. When we asked participants and GPT-4 why they thought their chosen comment was more constructive than the other, on average they selected three characteristics from the options given to them (See Figure  2 B). While assessing constructive comments, participants prioritized the use of logic and facts (21%) and presence of solutions (23%) more than other factors. In contrast, GPT-4 focused more on how well the comments balanced different viewpoints (25%) and maintained a polite tone (24%).

A chi-square test with Yates’ continuity correction revealed a significant difference in the perceived characteristics of constructive comments between participants and GPT-4 ( χ 2 ​ ( 4 , N = 2824 ) = 45.68 , p < 0.00001 , ϕ = 0.13 formulae-sequence superscript 𝜒 2

- 4 𝑁 2824 45.68 formulae-sequence 𝑝 0.00001 italic-ϕ 0.13 \chi^{2}(4,N=2824)=45.68,p<0.00001,\phi=0.13 ), with a small effect size. Post-hoc tests with Bonferroni corrections showed that GPT-4 associated the use of polite and respectful language (24% of cases) and balancing different viewpoints (25% of cases) with constructiveness significantly more than the participants (18% of cases for both characteristics). These characteristics are associated with dialectical argumentation and constructive discourse, which align with GPT-4’s greater preference for dialectical comments as constructive. In contrast, participants prioritized the presence of argumentative logic and facts (21% of cases) significantly more than GPT-4 (13% of cases) while assessing constructiveness.

Together, these findings indicate potential misalignment in the perceptions of constructiveness between humans and LLM. While both viewed comments with dialectical arguments as more constructive than the ones with logical arguments, GPT-4 was 2.46 times more likely to consider dialectical comments as more constructive than the human participants. GPT-4 also had significantly different perceptions of what makes an online comment constructive.

These differences could impact people’s engagement with LLM while writing constructive comments on divisive social issues, which we examine next.

###

4.2. RQ2: Can LLM Help People Write Constructive Comments?

In Phase 2, we collected 104 human-written comments (control group) and 102 HAI-written comments (test group) on homophobic and Islamophobic threads. Additionally, we had 64 LLM-generated comments from Phase 1 for these threads. We now present our analysis of these comments.

####

4.2.1. Who Writes Constructive Comments Better?

To examine whether comments written by humans, human-AI collaboration, or LLM (AI) are more constructive, we used human evaluations and analyzed linguistic features of constructiveness in the comments in our set.

Table 6 . Multiple Chi-square tests with Bonferroni corrections comparing people’s perceptions of constructiveness across (HAI vs. Human), (Human vs. AI), and (HAI vs. AI) comments.

Comment pairs |

Both demographic |

India |

US |

(HAI vs. AI) |

- |

- |

- |

(Human vs. AI) : |

LLM-generated comments perceived as more |

constructive than human-written comments |

χ 2 ​ ( 1 , N = 282 ) = 65.59 , superscript 𝜒 2

- 1 𝑁 282 65.59 \chi^{2}(1,N=282)=65.59, |

p < 0.000005 , ϕ = 0.48 formulae-sequence 𝑝 0.000005 italic-ϕ 0.48 p<0.000005,\phi=0.48 |

χ 2 ​ ( 1 , N = 148 ) = 19.70 , superscript 𝜒 2

- 1 𝑁 148 19.70 \chi^{2}(1,N=148)=19.70, |

p < 0.000005 , ϕ = 0.36 formulae-sequence 𝑝 0.000005 italic-ϕ 0.36 p<0.000005,\phi=0.36 |

χ 2 ​ ( 1 , N = 134 ) = 47.76 , superscript 𝜒 2

- 1 𝑁 134 47.76 \chi^{2}(1,N=134)=47.76, |

p < 0.000005 , ϕ = 0.60 formulae-sequence 𝑝 0.000005 italic-ϕ 0.60 p<0.000005,\phi=0.60 |

(HAI vs. Human) : |

HAI-written comments perceived as more |

constructive than human-written comments |

χ 2 ​ ( 1 , N = 802 ) = 62.56 , superscript 𝜒 2

- 1 𝑁 802 62.56 \chi^{2}(1,N=802)=62.56, |

p < 0.000005 , ϕ = 0.28 formulae-sequence 𝑝 0.000005 italic-ϕ 0.28 p<0.000005,\phi=0.28 |

χ 2 ​ ( 1 , N = 205 ) = 39.96 , superscript 𝜒 2

- 1 𝑁 205 39.96 \chi^{2}(1,N=205)=39.96, |

p < 0.000005 , ϕ = 0.31 formulae-sequence 𝑝 0.000005 italic-ϕ 0.31 p<0.000005,\phi=0.31 |

χ 2 ​ ( 1 , N = 392 ) = 22.54 , superscript 𝜒 2

- 1 𝑁 392 22.54 \chi^{2}(1,N=392)=22.54, |

p < 0.000005 , ϕ = 0.24 formulae-sequence 𝑝 0.000005 italic-ϕ 0.24 p<0.000005,\phi=0.24 |

Human Evaluation of Constructiveness. A total of 157 participants evaluated 727 pairs of comments, which included 401 pairs of (HAI vs. Human), 141 pairs of (Human vs. AI), and 185 pairs of (HAI vs. AI) comments.

Participants who assessed (Human vs. AI) comments found LLM-generated comments more constructive than human-written comments in the majority of cases (74%). Multiple Chi-square tests with Bonferroni corrections (see Table  6 ) revealed a significant difference in people’s perceptions of constructiveness, with a medium effect size ( χ 2 ​ ( 1 , N = 282 ) = 65.59 , p < 0.000005 , ϕ = 0.48 formulae-sequence superscript 𝜒 2

- 1 𝑁 282 65.59 formulae-sequence 𝑝 0.000005 italic-ϕ 0.48 \chi^{2}(1,N=282)=65.59,p<0.000005,\phi=0.48 , odds ratio=8.51). For (Human vs. AI) pairs, LLM-generated comments were 8.51 times more likely to be chosen as constructive. Both Indian and American participants also found LLM-generated comments significantly more constructive than human-written comments in 69% and 81% of cases, respectively (see Figure  3 ).

Figure 3 . People’s perceptions of constructiveness across (Human vs. AI), (HAI vs. Human), and (HAI vs. AI) comment pairs. Statistically significant differences are reported at p < 0.000005 𝑝 0.000005 p<0.000005 (****), p < 0.00005 𝑝 0.00005 p<0.00005 (***), p < 0.0005 𝑝 0.0005 p<0.0005 (**), and p < 0.005 𝑝 0.005 p<0.005 (*) [adjusted P-values after Bonferroni correction].

\Description

Grouped bar charts showing People perceived LLM-generated comments as more constructive than the human-written comments in 74% of pairs. Indian participants perceived LLM-generated comments as more constructive than the human-written comments in 69% of pairs. American participants perceived LLM-generated comments as more constructive than the human-written comments in 81% of pairs. Participants perceived HAI-written comments as more constructive than the human-written comments in 64% of pairs. Indian participants perceived HAI-written comments as more constructive than the human-written comments in 66% of pairs. American participants perceived HAI-written comments as more constructive than the human-written comments in 62% of pairs.

Similarly, participants, who reviewed (HAI vs. Human) comments found HAI-written comments significantly more constructive than human-written comments in 64% of cases, with small effect size ( χ 2 ​ ( 1 , N = 802 ) = 62.56 , p < 0.000005 , ϕ = 0.28 formulae-sequence superscript 𝜒 2

- 1 𝑁 802 62.56 formulae-sequence 𝑝 0.000005 italic-ϕ 0.28 \chi^{2}(1,N=802)=62.56,p<0.000005,\phi=0.28 , odds ratio=3.19). Participants were 3.19 times more likely to prefer HAI-written comments as constructive compared to human-written comments. Both Indian and American participants significantly preferred HAI-written comments to those solely written by humans in 66% and 62% of cases, respectively (see Figure  3 ).

On the other hand, those who reviewed (HAI vs. AI) comment pairs considered LLM-generated comments as constructive only in 55% of cases. We did not notice any significant difference between participants’ preferences for LLM-generated and HAI-written comments.

In sum, these findings suggest that comments that are either fully generated by LLM or co-written by human and LLM were viewed as more constructive by people than those written by humans alone.

Figure 4 . Features of constructiveness across LLM-generated, human-written, and HAI-written comments. The black dots represent the average value. Statistically significant differences are reported at p < 0.000001 𝑝 0.000001 p<0.000001 (****), p < 0.00001 𝑝 0.00001 p<0.00001 (***), p < 0.0001 𝑝 0.0001 p<0.0001 (**), and p < 0.001 𝑝 0.001 p<0.001 (*) [adjusted P-value after Bonferroni correction].

\Description

Eight grouped violin plots featuring how length, politeness, named entities, readability score, discourse connectives, stance adverbials, reasoning verbs and modals, and root clauses vary among LLM-generated, human-written, and HAI-written comments.

Linguistic Features of Constructiveness. To examine how features of constructiveness vary among LLM-generated, human-written, and HAI-written comments, we computed values for different linguistic features and conducted multiple pairwise Mann-Whitney tests with Bonferroni corrections (see Table  13 in Appendix). We found that LLM-generated comments had significantly more linguistic features of constructiveness than both human-written and HAI-written comments (see Figure  4 ). The effect size ranged from medium to large. LLM-generated comments were significantly longer and included more argumentative features, such as discourse connectives, stance adverbials, reasoning verbs and modals, and root clauses, compared to both human-written and HAI-written comments.

HAI-written comments also contained significantly more discourse connectives and stance adverbials than human-written comments. We noted that both LLM-generated and HAI-written comments had significantly higher readability score (as measured by SMOG index) than human-written comments. This suggests that comments either fully generated by LLM or collaboratively written with LLM have better wording and sentence structure than human-written comments.

Time Taken to Write Constructive Comments.

Participants who wrote comments with LLM (test group) took less time (average: 5.17 minutes) to write constructive comments than those who wrote everything on their own in control group (average: 6.71 minutes). A Mann-Whitney’s U test revealed a significant but small effect of LLM intervention on the time taken to write constructive comments ( W = 4071 , Z = − 2.88 , p < 0.01 , r = 0.2 formulae-sequence 𝑊 4071 formulae-sequence 𝑍 2.88 formulae-sequence 𝑝 0.01 𝑟 0.2 W=4071,Z=-2.88,p<0.01,r=0.2 ). While this is inline with prior findings  (Kim et al . , 2023 ) which show that people are able to write faster with the help of LLM, our work results show that not only do people write faster but also more constructively with the help of LLMs.

####

4.2.2. How does Co-Writing with LLM Change the Quality of Comments?

Participants in the test group initially drafted a comment before using LLM to make it more constructive. We next compared the initial drafts written by humans to final HAI-written comment submitted by them.

We found that participants requested assistance from LLM 138 times to write 102 constructive comments using 300 prompts in total (average: 2.88, SD: 2.36). Almost all participants chose the given prompts (see Table 7 ). They prioritized relevance, use of logic, and politeness to make their comments constructive. Only three participants wrote custom prompts, such as: ‘Make them sound dumb for being so bigoted’, ‘Be passive aggressive’, ‘Make it less rude’, and ‘Make the comment kind.’

Table 7 . Different prompts used by participants to make their comments constructive in the test group

Prompts |

Used (%) |

Make the comment relevant to the conversation |

23 |

Use logic and facts to make step-by-step argument |

23 |

Present solutions to address the issue |

18 |

Balance contrasting views and take middle ground |

12 |

Use polite and respectful tone |

23 |

Custom prompt |

1 |

Content Similarity.

We first examined to what extent the underlying LLM changes the content of the comments that participants initially wrote to the ones they submitted finally through human-AI collaboration.

In the test group, 87 participants incorporated LLM’s suggestion in the final comments they submitted. We calculated semantic similarity, BERTScore  (Zhang et al . , 2019 ) , and cosine similarity between each participant’s initial draft (before requesting help from LLM) and their submitted comment (LLM-rewritten version) to examine to what extent LLM changed people’s writing. All these scores are on a scale of 0 to 1 and higher values indicate greater similarity.

We found that the average semantic similarity between these comments was 0.67, indicating LLM could potentially retain the meanings of initial comments that participants wrote themselves (see Figure  5 A). Similarly, the average high BERTScore of 0.87 indicate that the LLM-rewritten versions closely aligned with the meanings in initial comments. However, the average cosine similarity between these comments was 0.38, indicating potential differences between the wording of these comments. For example, our analysis found that LLM-rewritten version of participants’ comments were significantly more positive and less toxic (average sentiment score: 0.67, toxicity score: 0.08) compared to the initial comments people wrote (average sentiment score: 0.12, toxicity score: 0.18) (see Figure  5 B–C).

Figure 5 . Comparison between different characteristics of comments that participants initially wrote themselves in the test group and the comment they submitted, where they used LLM’s suggestion. The black dots represent the average value. Statistically significant differences are reported at p < 0.000001 𝑝 0.000001 p<0.000001 (****), p < 0.00001 𝑝 0.00001 p<0.00001 (***), p < 0.0001 𝑝 0.0001 p<0.0001 (**), and p < 0.001 𝑝 0.001 p<0.001 (*) [adjusted P-value after Bonferroni correction].

\Description

Eight grouped violin plots featuring how length, politeness, named entities, readability score, discourse connectives, stance adverbials, reasoning verbs and modals, and root clauses vary among LLM-generated, human-written, and HAI-written comments.

Linguistic Features of Constructiveness. We also analyzed how LLM affected the linguistic features of constructiveness while rewriting participants’ comments (see Table  14 in Appendix). We found that LLM-rewritten versions were significantly longer (average length: 73 words) than the initial comments (average length: 49 words) and the effect size was large (see Figure  5 D). Additionally, the LLM integrated significantly more argumentative features, such as discourse connectives, stance adverbials, reasoning verbs and modals, and root clauses while rewriting participants’ comments, with medium to large effect size (see Figure  5 H–K).

We also found that LLM made participants’ comments significantly more polite (average score: 12.44) than their initial drafts (average score: 9.86), with medium effect size (see Figure  5 E). LLM-rewritten comments also had significantly higher readability score (average: 14.79) than the initial drafts participants wrote (average score: 5.85), exhibiting large effect size (see Figure  5 G). These differences suggest that LLM could present participants’ responses more constructively than they could do on their own.

####

4.2.3. Does Co-Writing Comments with LLM Lead to Homogeneity?

Recent studies have found that LLM-assisted writing tools homogenize outputs, i.e., different users relying on the same LLM may produce more similar writing than they would without such assistance (Kreminski, 2024 ) . To examine whether co-writing constructive comments with LLM leads to homogenity, we analyzed the cosine similarity, semantic similarity, and ROUGE-L  (Padmakumar and He, 2024 ) scores among HAI-written comments written on the same thread by different participants who share same stance. We repeated the same analysis for human-written comments in the control group to establish our baseline.

We found that the cosine similarity and semantic similarity in final comments written by participants in the test group were comparable to the similarity scores of comments written by participants in the control group (see Table  8 ). Multiple Mann-Whitney U tests with Bonferroni corrections did not show significant difference in these metrics between control and test groups. This indicates that even when participants took LLMs’ assistance to write constructive comments on the same thread from the same stance, the overlap in both word choice (cosine similarity) and meaning (semantic similarity) among their comments were similar to the overlap observed in comments written without the assistance of LLM.

Table 8 . Results from Mann-Whitney U tests with Bonferroni corrections for different metrics to assess homogeneity in HAI-written comments.

Metric |

Statistics |

Human-written |

comments (control) |

HAI-written |

comments (test) |

Cosine similarity |

- |

0.33 |

0.30 |

Semantic similarity |

- |

0.41 |

0.42 |

Rogue-L |

U=42029, Z=-3.73, p<0.001, r=0.16 |

0.18 |

0.16 |

Distinct-2 |

U=2153.5, Z=6.88, p<0.000001, r=0.50 |

0.97 |

0.99 |

Type token ratio |

U=1247.5, Z=8.66, p<0.000001, r=0.63 |

0.79 |

0.88 |

The ROUGE-L score (i.e., longest common subsequence) among human-written comments (average: 0.18) was significantly higher than that of HAI-written comments (average: 0.16). This suggests that participants in the control group

had greater overlap in their comments compared to the participants in the test group who co-wrote comments with LLM. In fact, both distinct-2 score and type token ratio (TTR) were significantly higher for the HAI-written comments, signaling greater diversity of vocabulary in these comments. Together, these findings suggest that using LLM to write constructive comments on socially divisive issues may not necessarily lead to homogeneous discourse online. This is critical because overwhelming agreement and homogeneity in online threads discourage people from engaging with that thread  (Grevet et al . , 2014 ) .

####

4.2.4. How did People Interact with LLM while Co-Writing Comments?

We next examined how participants engaged with the changes LLM made to their initial drafts. We quantitatively analyzed their interaction logs and performed qualitative analyses on the open-ended reasons participants gave for accepting, editing, rejecting, or regenerating the LLM’s suggestions.

Acceptance. In most cases (62%), participants accepted LLM-generated suggestions and reported that the suggestions captured their main points clearly ( n = 18 𝑛 18 n=18 ). Participants ( n = 9 𝑛 9 n=9 ) reported that LLM-generated versions were more persuasive, well-worded (higher readability score as observed in  4.2.2 ), and “presented cohesive arguments with actionable insights.” Some participants (n=4) appreciated that AI saved their time and effort, noting that it would take them significantly longer to “refine their thoughts” if they were to write constructively on their own. Others ( n = 4 𝑛 4 n=4 ) valued the polite language and impartial tone in content re-written by LLM. An American participant wrote:

I like AI assistance because it removes my own potential bias in these settings. I think being dismissive and defensive is never forward thinking. It is nice to remove some emotional substance when it is not needed.

Editing. In 9% of cases, participants either deleted some parts of LLM-generated content, changed wording (e.g., replaced ‘same-sex’ with ‘gay’, ‘concur’ with ‘agree’), or added new content. They explained that they found the content generated by LLM was either “too moderate” or misrepresented their views. An Indian participant, who was against same-sex marriage, shared:

I wrote about respecting LGBTQ communities and protecting their rights. But I strongly feel that legalizing LGBTQ marriages will imbalance both the culture and the nature. AI misunderstood my comment and wrote in favor of legalizing such marriages.

On average, people edited LLM’s suggestions in a way that made the comments significantly less positive (mean sentiment: 0.21) and more toxic (mean toxicity: 0.11) than the original suggestion (mean sentiment: 0.78, mean toxicity: 0.08). Paired t-tests with Bonferroni corrections revealed a significant effect of editing on the sentiment ( t ​ ( 9 ) = 3.83 , p < 0.01 formulae-sequence 𝑡 9 3.83 𝑝 0.01 t(9)=3.83,p<0.01 ) and toxicity ( t ​ ( 9 ) = − 2.82 , p < 0.01 formulae-sequence 𝑡 9 2.82 𝑝 0.01 t(9)=-2.82,p<0.01 ) of these comments. This indicates that LLMs might not be able to fully capture the diverse spectrum and nuances in a person’s stance on divisive issues.

Rejection and Regeneration. Participants regenerated and rejected LLM’s suggestions in 11% and 13% of cases, respectively. In the post-writing survey, participants reported that they regenerated suggestions because they were either verbose, “politically correct” , or used “HR-sounding language.” Those, who rejected the suggestions, either did not like the “formal and essay-like” and “non-human and AI-sounding” language. In several cases, participants disagreed with the framing in the suggestions. An Indian participant, who thought Islam incites extremism among its followers, reported:

I talked about how Muslims are very ‘hardcore’ compared to followers of other religion. But AI framed it as ‘deep-seated religious commitment’ to give it a positive spin, which I didn’t like. I also wrote about having uniform civil code to remove the exemption that Muslims enjoy regarding multiple marriages. But AI wrote about codifying such exemptions under uniform civil code, which I don’t agree with.

####

4.2.5. Experience of Writing Constructive Comments

Table  9 shows that participants in test group who used LLM while writing constructive comments were more satisfied with their comments (82%) than those who wrote on their own in the control group (77%). As expected, more participants in the control group (79%) reported feeling ownership over their comments than those in the test group (76%). However, we did not find any significant difference in the level of satisfaction and feeling of ownership between control and test groups.

Table 9 . Participants’ experiences of writing constructive comments

Satisfied (%) |

Feeling of ownership (%) |

Perceived difficulty (%) |

Human-written comments (Control) |

77 |

79 |

31 |

HAI-written comments (Test) |

82 |

76 |

16 |

On average, more participants in the control group (31%) reported that writing constructive comments was difficult on their own than those who received LLM’s suggestions (16%). However, we did not find any significant difference in the perceived difficulty of writing constructive comments either with or without LLM. This indicates that LLM has the potential to help people write constructive comments on polarizing topics without significantly impacting the value people find while expressing their opinions.

###

4.3. RQ3: Do Perceptions of Constructiveness Vary by Culture?

Throughout Phase 1 and Phase 2, we identified several points of analysis to examine cross-cultural differences in how people approach constructive comments, which we outline below.

Perceptions of Constructiveness. Prior research shows that people from individualistic cultures (e.g., the US) prefer logical reasoning during argumentation  (Norenzayan et al . , 2002 ) while those from collectivist cultures (e.g., India) prefer dialectical arguments during conflict  (Peng and Nisbett, 1999 ) . However, contrary to our hypothesis, in Phase 1, both American and Indian participants rated dialectical comments as more constructive than the logical comments in 73% and 65% of cases, respectively. A binomial test revealed that American participants’ preference for dialectical comments significantly differed ( p < 0.000001 𝑝 0.000001 p<0.000001 ) from the expected distribution (40% as observed in  Peng ( 1997 ) ). Moreover, the reasons provided by participants for choosing one comment over the other were similar (see Table  15 in Appendix), suggesting a shared understanding of constitutes as a constructive comment on socially divisive issues.

Writing Constructive Comments with and without LLM. In Phase 2, to identify cross-cultural differences in how participants in India and the US write constructive comments on socially divisive issues, we compared the comments written by Indian and American participants first within control groups and then also within the test groups. An analysis of linguistic features of constructiveness in these comments did not reveal any significant differences based on culture (see Table  16 in Appendix). These findings suggest that Indian and American participants demonstrated similar linguistic markers of constructiveness in the comments they wrote.

However, we found that, on average, American participants took less time (5.2 minutes) to write constructive comments compared to Indian participants (6.7 minutes) in the control groups. A Mann-Whitney U test revealed a significant but small effect of culture on the time taken to write constructive comments ( U = 6742 , Z = 3.36 , p < 0.001 , r = 0.23 formulae-sequence 𝑈 6742 formulae-sequence 𝑍 3.36 formulae-sequence 𝑝 0.001 𝑟 0.23 U=6742,Z=3.36,p<0.001,r=0.23 ). This difference could be attributed to the fact that English is not the native language of most people in India.

Table 10 . Prompts used by Indian and American Participants in the test group

Prompts |

India (%) |

US (%) |

Make the comment relevant to the conversation |

27 |

21 |

Use logic and facts to make step-by-step argument |

21 |

25 |

Present solutions to address the issue |

19 |

17 |

Balance contrasting views and take middle ground |

10 |

14 |

Use polite and respectful tone |

23 |

24 |

Additionally, in the test group, we did not find any significant differences in the distribution of prompts that Indian and American participants used to make their comments more constructive (see Table  10 ). The top three prompts used by participants in India and the US were: “making the comment relevant to the conversation” , “using logical argument” , and “polite and respectful tone.” This suggests that, despite cultural differences in argumentation styles, people from both individualistic and collectivist cultures may converge in their approaches to writing constructive comments with help of LLM on socially divisive issues like homophobia and Islamophobia.

Human Evaluations of Constructiveness. We next examined cross-cultural differences in the preferences of Indian and American participants among constructive comments written by humans, through human-AI collaboration, and solely by LLM. To do this, we analyzed participants’ ratings for the constructiveness in (HAI vs. Human), (Human vs. AI), and (HAI vs. AI) comment pairs. In (Human vs. AI) comments, 81% of American and 69% of Indian participants considered LLM-generated comments more constructive than human-written ones. Similarly, in (HAI vs. AI) comment pairs, both American (59%) and Indian (51%) participants rated LLM-generated comments as more constructive. When reviewing (HAI vs. Human) comment pairs, participants in both groups showed similar preference for HAI-written comments (US: 62%, India: 66%). Multiple chi-square tests with Bonferroni corrections revealed no significant differences between Indian and American participants’ preferences across all comment pairs, indicating that cultural background did not significantly affect perceptions of constructiveness in LLM-generated, HAI-written, or human-only comments.

Together, these findings indicate that, when addressing socially divisive issues like homophobia and Islamophobia, people in India and the US may share similar mental models of what constitutes a constructive comment online.

##

5. Discussion

###

5.1. Promoting Constructive Discourse Online

Through cross-cultural experiments with American and Indian participants, we demonstrate that LLMs can help people from different cultures write constructive comments on divisive social issues like homophobia and Islamophobia. Our findings show that comments generated solely by an LLM or co-written with an LLM were perceived as more constructive than those written by humans alone. The LLM-generated and HAI-written comments also displayed significantly more constructive features than those written by humans alone. When participants prompted the LLM to make their comments constructive, it made the comments longer, more polite, positive, less toxic, and more readable, while enhancing argumentative features and preserving the original meaning. Overall, participants found the LLM helpful, were satisfied with the outputs as the LLM articulated their points clearly, and reduced the perceived difficulty of writing constructive comments.

These findings align with prior research showing that LLMs are capable of rephrasing users’ messages to convey respectful listening  (Argyle et al . , 2023 ) and enhance receptiveness to opposing views  (Kambhatla et al . , 2024 ) . As a result, many people find these LLM augmented tools valuable on countering hateful opinions during online conflicts  (Mun et al . , 2024 ) . Recipients also perceive LLM-generated arguments stronger, more persuasive, and positive than those written by humans  (Karinshak et al . , 2023 ; Argyle et al . , 2023 ; Kambhatla et al . , 2024 ) .

Our work contributes to this line of research in two key ways. First, we show that LLMs can help people write constructive comments in response to contentious online threads on divisive issues. In contrast, most prior research has focused on LLMs’ capabilities in helping users craft argumentative essays on select topics or in private, one-on-one debates  (Lee et al . , 2022a ; Dang et al . , 2023 ; Zhang et al . , 2023 ; Argyle et al . , 2023 ) . Second, we draw from cross-cultural differences in argumentation to reveal potential misalignment between human and LLM’s perceptions of constructiveness based on different argumentation styles (Section  5.2 ).

While our findings show a promise that LLMs can assist users in constructively engaging in online debates on divisive social issues, there are some caveats. To begin with, such prosocial interventions promoting constructive discourse are particularly beneficial for well-intentioned users, who may not realize toxicity in their writing or who, in heated moments, get “emotionally triggered” and unintentionally use offensive or slighted language  (Warner et al . , 2024 ; Kiskola et al . , 2023 ) . LLM-infused writing tools can encourage greater mindfulness during online conflicts, helping users avoid comments they might regret later  (Sleeper et al . , 2013 ; Warner et al . , 2021 ) .

Such tools can also help shift some responsibility for addressing hateful interactions during conflicts onto senders themselves, and could prove particularly useful in end-to-end encrypted platforms, such as WhatsApp groups, where hateful content flourishes due to limited moderation  (Saha et al . , 2021 ) .

While such tools may not deter users who intentionally spread hateful rhetoric, they could empower bystander users to challenge problematic behavior by providing support to express disagreement constructively  (Baughan et al . , 2021 ; Gurgun et al . , 2023 ) . This could be especially valuable in situations, where users might hesitate to intervene due to the effort and emotional toll involved in participating in online debate without support.

###

5.2. Human-AI Misalignment in Constructive Discourse

Although our findings show that LLMs could help people write constructive comments on divisive issues, we found key differences between LLMs and humans in their understanding of what constitutes constructiveness. For instance, in our study, the LLM rated dialectical comments as significantly more constructive than humans did. The LLM prioritized politeness, balanced viewpoints, and a middle-ground approach, whereas humans favored evidence-based, logical argumentation while assessing constructiveness. This misalignment is likely to affect how humans and LLMs approach constructive disagreement. For example, Mun et al . ( 2023 ) note that human-written counter-speech employs more specific strategies, such as providing counterexamples and stating facts, both of which are characteristics of logical argumentation. In contrast, LLM-generated counter-speech tends to be less specific and broadly denounces hatefulness  (Mun et al . , 2023 ) , aligning more with the middle-ground approach of dialectical argumentation. Due to these differences, humans often perceive LLM-generated counter-speech as less convincing.

In our study, this misalignment often led participants to reject, regenerate, or edit the LLM’s suggestions, resulting in comments that were significantly more negative and toxic. Research shows that LLMs tend to prioritize “surface-level” lexical cues (e.g., joy, anger, fear, offensiveness) more than humans do while assessing sentiment  (Das et al . , 2024 ) . We observed similar effects in Human-AI written comments in our study. As a result, several participants who rejected or edited LLM-generated suggestions reported not liking the formal, moderate, and non-human sounding language. In line with these findings, Zhang et al . ( 2023 ) also found that users often perceive LLM-generated suggestions to be “robotic, monotonous, and repetitive” while writing long argumentative essays.

We also found that some participants felt frustrated when the LLM misrepresented their opinions, especially when their views were nuanced rather than outright polarizing (e.g., user supported LGBTQ communities but opposed legalizing same-sex marriage). While this suggests that LLMs may struggle to capture the subtleties and complexities of people’s stances, it also raises important questions about how human-AI misalignment in expressing disagreements could impact deliberation on divisive issues. For example, prior studies show that different cultures and communities have different boundaries and tolerance for the language used online. Some users strongly value expressing opinions in an uncensored way and find it patronizing when comments are moderated to be positive  (Kiskola et al . , 2023 ) . Close friends often use curse words to reflect real-life rapport, yet algorithms might flag and remove these interactions as inappropriate  (Shahid and Vashistha, 2023 ) . Similarly, in some communities (e.g., LGBTQ+ forums), toxic language is sometimes used to foster in-group solidarity through humor  (Warner et al . , 2024 ) . It is possible that LLM suggestions turn out to be less useful in such groups that might be open to having more direct and uncensored dialogue on divisive issues. In such cases, it is crucial for LLMs to preserve user autonomy and provide them the choice to either rephrase or retain their writing.

LLM’s tendency to align with mainstream or dominant views and to generate responses that lack diversity in perspectives raise concerns about their ability to accurately reflect varied opinions  (Das et al . , 2024 ) . While we did not find evidence of homogenization in human-AI written comments, this might be because participants had to write their opinions first before prompting the LLM to rephrase their comments. The distinction between prompting LLMs to rephrase comments versus co-writing comments with auto-complete LLM suggestions holds significant design implications, as several studies show that auto-complete suggestions from LLMs shift people’s viewpoints and homogenize their writing  (Jakesch et al . , 2023 ; Williams-Ceci et al . , 2024 ; Agarwal et al . , 2024 ) . Moreover, prior studies show that people fear reframing their messages with LLMs would undermine their agency and credibility, resulting in insincere, diluted, and morally compromising responses  (Mun et al . , 2024 ; Baughan et al . , 2021 ) . For example, one of our participants reported accepting LLM-generated “neutral” suggestions while responding to an Islamophobic thread because they suspected their views might be “too biased to meet the appropriate criteria” because they were Muslim. Thus, suggestions from LLM can lead to algorithmic conformity  (Liel and Zalmanson, 2020 ) , suppress minority viewpoints, and curb freedom of speech over time  (Feuston et al . , 2020 ) if individuals and communities start adjusting their opinions to conform to what LLMs think as “constructive.” Therefore, a systematic investigation is needed to determine how suggestions in the form of auto-complete or rephrasing might affect homogenization in writing.

###

5.3. Enabling Constructive Discourse Across Cultures

Prior research in cultural studies shows that people from individualistic cultures prefer logical arguments, whereas those from collectivist cultures favor dialectical arguments  (Norenzayan et al . , 2002 ; Peng and Nisbett, 1999 ; Nisbett et al . , 2001 ) . However, our study did not find significant difference between Indian and American participants’ preferences for logical versus dialectical comments as constructive. Even the prompts chosen to make comments more constructive were similar across both groups. This could be because the existing work on cross-cultural differences in argumentation is based on either offline conflicts  (Ohbuchi and Takahashi, 1994 ) or long-form argumentative essays  (Norenzayan et al . , 2000 , 2002 ) , which may not directly apply to short-form online comments. For instance, Toulmin’s logical argumentation framework includes six elements: claim, data, warrant, backing, qualifier, and rebuttal  (Hitchcock and Verheij, 2006 ) . However, in our study, the LLM-generated, human-written, and HAI-written comments averaged 70-80 words in length, which may be too brief to capture all elements of argumentation. This brevity might have made it difficult for people to distinguish between logical and dialectical styles.

In future research, we plan to conduct follow-up experiments using comments of varying lengths to examine if comment length influences preferences for logical versus dialectical comments in online debates on divisive issues.

Additionally, for culturally grounded writing tasks, LLM-generated suggestions have been shown to lead Indian participants to adopt Western writing styles  (Agarwal et al . , 2024 ) . In our study, American and Indian participants responded to different threads relevant to their cultural contexts, which prevented a direct comparison of their comments to determine if cultural homogenization occurred when co-writing constructive comments with the LLM. Therefore, in future research, we plan to investigate comments from Indian and American participants written in response to the same threads that are relevant to both cultural contexts. To address cultural homogenization from biased LLMs, techniques such as anthropological prompting  (AlKhamissi et al . , 2024 ) , cultural prompting  (Tao et al . , 2024 ) , self-pluralism  (Xu et al . , 2024 ) , modular pluralism  (Feng et al . , 2024 ) , or value-pluralistic design  (Sorensen et al . , 2024 ) —which have been shown to increase cultural alignment in LLM-generated responses—are necessary to design HAI-collaborative systems to support prosocial discourse online on a global scale.

###

5.4. Ethical Consideration and Feasibility of Facilitating Constructive Discourse

Apart from the benefits of promoting constructive discourse, we need to critically think about the potential biases and abuses stemming from such systems. For instance, LLMs have been shown to produce responses with covert cultural harms in seemingly neutral language that are unlikely to be detected by existing methods  (Dammu et al . , 2024 ) . Since we only used existing sentiment and toxicity analyses tools, we may not have uncovered such covert biases in HAI-written comments. However, manual inspection of the LLM-generated comments from Phase 1 revealed statements like “…its [Islam’s] damaging treatment towards women, LGBTQ+ individuals, and non-Muslims…” – generated in response to an Islamophobic thread from the stance of opposing Islamophobia.

If LLMs perpetuate such covert biases in the form of “constructive” discourse while taking the stance of supporting marginalized communities, it would strengthen existing stereotypes and potentially harm marginalized individuals.

Carstens and Friess ( 2024 ) have also critiqued such AI tools due to their simplified view of online civility. They argue that apart from input-output, these systems need to be evaluated within existing social inequalities and hierarchies. Because, the argumentative norms facilitated by these tools would privilege expressions from highly educated people, who usually have better training in writing such arguments, while disregarding linguistic and cultural variations.

Additionally, existing research on the role of LLMs in promoting prosocial discourse has primarily relied on crowd evaluations  (Kambhatla et al . , 2024 ) or assessed receptiveness only among small group of discussants  (Argyle et al . , 2023 ; Tessler et al . , 2024 ) . Although research shows that promoting civil dialogue can actually enhance user engagement on the platform  (Liu et al . , 2024 ) , there is limited understanding of how such interventions would work in large online communities, where the discussions can be viewed by anyone. Cho et al . ( 2023 ) have noticed that that even when LLM-based intervention encourages deep listening, empathy, and critical thinking, it struggles to instill respectful and cooperative attitude among people. Therefore, future work should look into: how many users need to write their comments constructively to affect the course of a divisive online thread? How would this affect users’ engagement and subsequent conversation quality?

###

5.5. Limitations and Generalizability

As an early study, our work has several limitations. First, we focused on two divisive social issues—Islamophobia and homophobia—and participants from two geographies, India and the US, as proxies for different cultures. Therefore, the findings may not be generalizable to other regions or social issues.

Second, while prior research indicates that annotators’ identities influence how they perceive online content  (Sap et al . , 2022 ) , our analysis did not account for how participants’ identities might have shaped their perceptions and evaluations of constructiveness in the comments. To mitigate this, we ensured participants reviewed comments from the same stance when making judgments. However, future research should deeply look into whether identity influences perceptions of constructive comments in online debates on divisive topics.

Third, although our results provide initial evidence that LLMs can help people write more constructive comments, we assessed audiences’ perceptions rather than measuring whether these comments effectively change the audience’s opinions on divisive issues or foster common ground. We also did not investigate the threshold of constructive comments needed in an online debate to shift the tone of the conversation. While this is not necessarily an inherent limitation of our study, it represents a critical next step that we aim to address in future research.

## References

(1)

Agarwal et al . (2024)

Dhruv Agarwal, Mor Naaman, and Aditya Vashistha. 2024.

AI Suggestions Homogenize Writing Toward Western Styles and Diminish Cultural Nuances.

AlKhamissi et al . (2024)

Badr AlKhamissi, Muhammad ElNokrashy, Mai AlKhamissi, and Mona Diab. 2024.

Investigating cultural alignment of large language models.

Argyle et al . (2023)

Lisa P Argyle, Christopher A Bail, Ethan C Busby, Joshua R Gubler, Thomas Howe, Christopher Rytting, Taylor Sorensen, and David Wingate. 2023.

Leveraging AI for democratic discourse: Chat interventions can improve online political conversations at scale.

Proceedings of the National Academy of Sciences 120, 41 (2023), e2311627120.

Bächtiger and Parkinson (2019)

André Bächtiger and John Parkinson. 2019.

Mapping and measuring deliberation: Towards a new deliberative quality .

Oxford University Press, United Kingdom.

Baughan et al . (2021)

Amanda Baughan, Justin Petelka, Catherine Jaekyung Yoo, Jack Lo, Shiyue Wang, Amulya Paramasivam, Ashley Zhou, and Alexis Hiniker. 2021.

Someone Is Wrong on the Internet: Having Hard Conversations in Online Spaces.

Proc. ACM Hum.-Comput. Interact. 5, CSCW1, Article 156 (apr 2021), 22 pages.

Berry and Taylor (2017)

George Berry and Sean J. Taylor. 2017.

Discussion Quality Diffuses in the Digital Public Square. In Proceedings of the 26th International Conference on World Wide Web . International World Wide Web Conferences Steering Committee, Republic and Canton of Geneva, CHE, 1371–1380.

Borelli (2022)

Gabriel Borelli. 2022.

About six-in-ten Americans say legalization of same-sex marriage is good for society.

Retrieved October 18, 2024 from https://www.pewresearch.org/short-reads/2022/11/15/about-six-in-ten-americans-say-legalization-of-same-sex-marriage-is-good-for-society/

Bossens et al . (2021)

Emilie Bossens, Elias Storms, and David Geerts. 2021.

Improving the Debate: Interface Elements that Enhance Civility and Relevance in Online News Comments. In IFIP Conference on Human-Computer Interaction . Springer, Switzerland, 433–450.

Cao et al . (2023)

Yong Cao, Li Zhou, Seolhwa Lee, Laura Cabello, Min Chen, and Daniel Hershcovich. 2023.

Assessing Cross-Cultural Alignment between ChatGPT and Human Societies: An Empirical Study.

arXiv:2303.17466 [cs.CL]

Carstens and Friess (2024)

Jonas Aaron Carstens and Dennis Friess. 2024.

AI Within Online Discussions: Rational, Civil, Privileged?

Minds and Machines 34, 2 (2024), 1–25.

Center (2017)

Pew Research Center. 2017.

How the U.S. general public views Muslims and Islam.

Retrieved October 18, 2024 from https://www.pewresearch.org/religion/2017/07/26/how-the-u-s-general-public-views-muslims-and-islam/

Chang et al . (2022)

Jonathan P. Chang, Charlotte Schluger, and Cristian Danescu-Niculescu-Mizil. 2022.

Thread With Caution: Proactively Helping Users Assess and Deescalate Tension in Their Online Discussions.

Proc. ACM Hum.-Comput. Interact. 6, CSCW2, Article 545 (nov 2022), 37 pages.

Cho et al . (2023)

Hyundong Cho, Shuai Liu, Taiwei Shi, Darpan Jain, Basem Rizk, Yuyang Huang, Zixun Lu, Nuan Wen, Jonathan Gratch, Emilio Ferrera, et al . 2023.

Can Language Model Moderators Improve the Health of Online Discourse?

Choi et al . (2007)

Incheol Choi, Minkyung Koo, and Jong An Choi. 2007.

Individual differences in analytic versus holistic thinking.

Personality and social psychology bulletin 33, 5 (2007), 691–705.

Choi (1988)

Yeon Hee Choi. 1988.

Text structure of Korean speakers’ argumentative essays in English.

World Englishes 7, 2 (1988), 129–137.

Collier and Bear (2012)

Benjamin Collier and Julia Bear. 2012.

Conflict, criticism, or confidence: an empirical examination of the gender gap in wikipedia contributions. In Proceedings of the ACM 2012 Conference on Computer Supported Cooperative Work (Seattle, Washington, USA) (CSCW ’12) . ACM, New York, USA, 383–392.

Croucher et al . (2009)

Stephen M Croucher, Ramune Braziunaite, Dini Homsey, Gayatre Pillai, Jagruti Saxena, Ashish Saldanha, Vikrant Joshi, Imran Jafri, Pavan Choudhary, Lalima Bose, et al . 2009.

Organizational dissent and argumentativeness: A comparative analysis between American and Indian organizations.

Journal of Intercultural Communication Research 38, 3 (2009), 175–191.

Cutler et al . (2022)

Stephanie Cutler, Yu Xia, and Kacey Beddoes. 2022.

A Growth Mindset for Peer Review: Guidelines for writing constructive peer reviews.

Dammu et al . (2024)

Preetam Prabhu Srikar Dammu, Hayoung Jung, Anjali Singh, Monojit Choudhury, and Tanushree Mitra. 2024.

“They are uncultured”: Unveiling Covert Harms and Social Threats in LLM Generated Conversations.

Dang et al . (2023)

Hai Dang, Sven Goller, Florian Lehmann, and Daniel Buschek. 2023.

Choice Over Control: How Users Write with Large Language Models using Diegetic and Non-Diegetic Prompting. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . ACM, New York, USA, Article 408, 17 pages.

Das et al . (2024)

Debarati Das, Karin De Langis, Anna Martin, Jaehyung Kim, Minhwa Lee, Zae Myung Kim, Shirley Hayati, Risako Owan, Bin Hu, Ritik Parkar, et al . 2024.

Under the surface: Tracking the artifactuality of llm-generated data.

De Kock et al . (2022)

Christine De Kock, Tom Stafford, and Andreas Vlachos. 2022.

How to disagree well: Investigating the dispute tactics used on Wikipedia. In Proceedings of the 2022 Conference on Empirical Methods in Natural Language Processing , Yoav Goldberg, Zornitsa Kozareva, and Yue Zhang (Eds.). Association for Computational Linguistics, Abu Dhabi, United Arab Emirates, 3824–3837.

De Kock and Vlachos (2021)

Christine De Kock and Andreas Vlachos. 2021.

I Beg to Differ: A study of constructive disagreement in online conversations. In Proceedings of the 16th Conference of the European Chapter of the Association for Computational Linguistics: Main Volume , Paola Merlo, Jorg Tiedemann, and Reut Tsarfaty (Eds.). Association for Computational Linguistics, Online, 2017–2027.

Deutsch (1994)

Morton Deutsch. 1994.

Constructive conflict resolution: Principles, training, and research.

Journal of social issues 50, 1 (1994), 13–32.

Diakopoulos (2015)

Nicholas Diakopoulos. 2015.

Picking the NYT picks: Editorial criteria and automation in the curation of online news comments.

ISOJ Journal 6, 1 (2015), 147–166.

Diakopoulos and Naaman (2011)

Nicholas Diakopoulos and Mor Naaman. 2011.

Towards quality discourse in online news comments. In Proceedings of the ACM 2011 Conference on Computer Supported Cooperative Work (Hangzhou, China) (CSCW ’11) . ACM, New York, USA, 133–142.

Ding et al . (2024)

Xiaohan Ding, Kaike Ping, Uma Sushmitha Gunturi, Buse Carik, Sophia Stil, Lance T Wilhelm, Taufiq Daryanto, James Hawdon, Sang Won Lee, and Eugenia H Rho. 2024.

CounterQuill: Investigating the Potential of Human-AI Collaboration in Online Counterspeech Writing.

Esau et al . (2017)

Katharina Esau, Dennis Friess, and Christiane Eilders. 2017.

Design matters! An empirical analysis of online deliberation on different news platforms.

Policy & Internet 9, 3 (2017), 321–342.

Feng et al . (2024)

Shangbin Feng, Taylor Sorensen, Yuhan Liu, Jillian Fisher, Chan Young Park, Yejin Choi, and Yulia Tsvetkov. 2024.

Modular pluralism: Pluralistic alignment via multi-llm collaboration.

Feuston et al . (2020)

Jessica L Feuston, Alex S Taylor, and Anne Marie Piper. 2020.

Conformity of eating disorders through content moderation.

Proceedings of the ACM on Human-Computer Interaction 4, CSCW1 (2020), 1–28.

Fong et al . (2016)

Carlton J Fong, Jayce R Warner, Kyle M Williams, Diane L Schallert, Ling-Hui Chen, Zachary H Williamson, and Shengjie Lin. 2016.

Deconstructing constructive criticism: The nature of academic emotions associated with constructive, positive, and negative feedback.

Learning and Individual Differences 49 (2016), 393–399.

Friess and Eilders (2015)

Dennis Friess and Christiane Eilders. 2015.

A systematic review of online deliberation research.

Policy & Internet 7, 3 (2015), 319–339.

Govers et al . (2024)

Jarod Govers, Eduardo Velloso, Vassilis Kostakos, and Jorge Goncalves. 2024.

AI-Driven Mediation Strategies for Audience Depolarisation in Online Debates. In Proceedings of the CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, USA, Article 803, 18 pages.

Grevet et al . (2014)

Catherine Grevet, Loren G. Terveen, and Eric Gilbert. 2014.

Managing political differences in social media. In Proceedings of the 17th ACM Conference on Computer Supported Cooperative Work & Social Computing . ACM, New York, USA, 1400–1408.

Gurgun et al . (2023)

Selin Gurgun, Emily Arden-Close, John McAlaney, Keith Phalp, and Raian Ali. 2023.

Can We Re-design Social Media to Persuade People to Challenge Misinformation? An Exploratory Study. In International Conference on Persuasive Technology . Springer, Germany, 123–141.

Hample and Anagondahalli (2015)

Dale Hample and Deepa Anagondahalli. 2015.

Understandings of arguing in India and the United States: Argument frames, personalization of conflict, argumentativeness, and verbal aggressiveness.

Journal of Intercultural Communication Research 44, 1 (2015), 1–26.

Hill et al . (1986)

Beverly Hill, Sachiko Ide, Shoko Ikuta, Akiko Kawasaki, and Tsunao Ogino. 1986.

Universals of linguistic politeness: Quantitative evidence from Japanese and American English.

Journal of pragmatics 10, 3 (1986), 347–371.

Hitchcock and Verheij (2006)

David Hitchcock and Bart Verheij. 2006.

Arguing on the Toulmin model . Vol. 10.

Springer, New York, USA.

Holtgraves and Joong-Nam (1990)

Thomas Holtgraves and Yang Joong-Nam. 1990.

Politeness as universal: Cross-cultural perceptions of request strategies and inferences based on their use.

Journal of personality and social psychology 59, 4 (1990), 719.

Hutto and Gilbert (2014)

Clayton Hutto and Eric Gilbert. 2014.

Vader: A parsimonious rule-based model for sentiment analysis of social media text.

Proceedings of the international AAAI conference on web and social media 8, 1 (2014), 216–225.

Jakesch et al . (2023)

Maurice Jakesch, Advait Bhat, Daniel Buschek, Lior Zalmanson, and Mor Naaman. 2023.

Co-Writing with Opinionated Language Models Affects Users’ Views. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . ACM, New York, USA, Article 111, 15 pages.

Jhaver et al . (2017)

Shagun Jhaver, Pranil Vora, and Amy Bruckman. 2017.

Designing for civil conversations: Lessons learned from ChangeMyView.

Johnson et al . (2022)

Rebecca L Johnson, Giada Pistilli, Natalia Menédez-González, Leslye Denisse Dias Duran, Enrico Panai, Julija Kalpokiene, and Donald Jay Bertulfo. 2022.

The Ghost in the Machine has an American accent: value conflict in GPT-3.

arXiv:2203.07785 [cs.CL]

Kambhatla et al . (2024)

Gauri Kambhatla, Matthew Lease, and Ashwin Rajadesingan. 2024.

Promoting Constructive Deliberation: Reframing for Receptiveness.

Kapoor et al . (2003)

Suraj Kapoor, Patrick C Hughes, John R Baldwin, and Janet Blue. 2003.

The relationship of individualism–collectivism and self-construals to communication styles in India and the United States.

International Journal of Intercultural Relations 27, 6 (2003), 683–700.

Karinshak et al . (2023)

Elise Karinshak, Sunny Xun Liu, Joon Sung Park, and Jeffrey T. Hancock. 2023.

Working With AI to Persuade: Examining a Large Language Model’s Ability to Generate Pro-Vaccination Messages.

Proc. ACM Hum.-Comput. Interact. 7, CSCW1, Article 116 (2023), 29 pages.

Katsaros et al . (2022)

Matthew Katsaros, Kathy Yang, and Lauren Fratamico. 2022.

Reconsidering tweets: Intervening during tweet creation decreases offensive content. In Proceedings of the International AAAI Conference on Web and Social Media , Vol. 16. Association for the Advancement of Artificial Intelligence, Washington DC, USA, 477–487.

Kim et al . (2022)

Jisu Kim, Curtis McDonald, Paul Meosky, Matthew Katsaros, and Tom Tyler. 2022.

Promoting online civility through platform architecture.

Journal of Online Trust and Safety 1, 4 (2022), 23 pages.

Kim et al . (2023)

Jeongyeon Kim, Sangho Suh, Lydia B Chilton, and Haijun Xia. 2023.

Metaphorian: Leveraging Large Language Models to Support Extended Metaphor Creation for Science Writing. In Proceedings of the 2023 ACM Designing Interactive Systems Conference (Pittsburgh, PA, USA) (DIS ’23) . ACM, New York, USA, 115–135.

Kiskola et al . (2023)

Joel Kiskola, Thomas Olsson, Anna Rantasila, Aleksi H Syrjämäki, Mirja Ilves, Poika Isokoski, and Veikko Surakka. 2023.

User-centred quality of UI interventions aiming to influence online news commenting behaviour.

Behaviour & Information Technology 42, 12 (2023), 2060–2092.

Kolhatkar and Taboada (2017a)

Varada Kolhatkar and Maite Taboada. 2017a.

Constructive Language in News Comments. In Proceedings of the First Workshop on Abusive Language Online , Zeerak Waseem, Wendy Hui Kyong Chung, Dirk Hovy, and Joel Tetreault (Eds.). ACL, Vancouver, Canada, 11–17.

Kolhatkar and Taboada (2017b)

Varada Kolhatkar and Maite Taboada. 2017b.

Using New York Times Picks to Identify Constructive Comments. In Proceedings of the 2017 EMNLP Workshop: Natural Language Processing meets Journalism , Octavian Popescu and Carlo Strapparava (Eds.). ACL, Copenhagen, Denmark, 100–105.

Kolhatkar et al . (2020)

Varada Kolhatkar, Nithum Thain, Jeffrey Sorensen, Lucas Dixon, and Maite Taboada. 2020.

Classifying constructive comments.

Kraut (2012)

RE Kraut. 2012.

Building Successful Online Communities: Evidence-based Social Design .

MIT Press, Cambridge, MA, USA.

Kreminski (2024)

Max Kreminski. 2024.

The Dearth of the Author in AI-Supported Writing. In Proceedings of the Third Workshop on Intelligent and Interactive Writing Assistants (Honolulu, HI, USA) (In2Writing ’24) . ACM, New York, USA, 48–50.

Kriplean et al . (2012a)

Travis Kriplean, Jonathan Morgan, Deen Freelon, Alan Borning, and Lance Bennett. 2012a.

Supporting reflective public thought with considerit. In Proceedings of the ACM 2012 Conference on Computer Supported Cooperative Work (Seattle, Washington, USA) (CSCW ’12) . ACM, New York, USA, 265–274.

Kriplean et al . (2012b)

Travis Kriplean, Michael Toomim, Jonathan Morgan, Alan Borning, and Amy J. Ko. 2012b.

Is this what you meant? promoting listening on the web with reflect. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (Austin, Texas, USA) (CHI ’12) . ACM, New York, USA, 1559–1568.

Lee et al . (2022a)

Mina Lee, Percy Liang, and Qian Yang. 2022a.

CoAuthor: Designing a Human-AI Collaborative Writing Dataset for Exploring Language Model Capabilities. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . ACM, New York, USA, Article 388, 19 pages.

Lee et al . (2022b)

Mina Lee, Percy Liang, and Qian Yang. 2022b.

CoAuthor: Designing a Human-AI Collaborative Writing Dataset for Exploring Language Model Capabilities. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . ACM, New York, USA, Article 388, 19 pages.

Liel and Zalmanson (2020)

Yotam Liel and Lior Zalmanson. 2020.

What if an AI told you that 2+ 2 is 5? Conformity to algorithmic recommendations.

Liu et al . (2024)

Tony Liu, Lyle Ungar, Konrad Kording, and Morgan McGuire. 2024.

Measuring Causal Effects of Civil Communication without Randomization. In Proceedings of the International AAAI Conference on Web and Social Media , Vol. 18. AAAI Press, Washington DC, USA, 958–971.

Ludwig (2014)

Bradley Stephen Ludwig. 2014.

The rhetorical constitution of online community: Identification and constitutive rhetoric in the community of reddit.

Masrani et al . (2023)

Teale W. Masrani, Jack Jamieson, Naomi Yamashita, and Helen Ai He. 2023.

Slowing it Down: Towards Facilitating Interpersonal Mindfulness in Online Polarizing Conversations Over Social Media.

Proc. ACM Hum.-Comput. Interact. 7, CSCW1, Article 90 (2023), 27 pages.

Mcalister et al . (2004)

Simon Mcalister, Andrew Ravenscroft, and Eileen Scanlon. 2004.

Combining interaction and context design to support collaborative argumentation using a tool for synchronous CMC.

Journal of Computer Assisted Learning 20, 3 (2004), 194–204.

Mun et al . (2023)

Jimin Mun, Emily Allaway, Akhila Yerukola, Laura Vianna, Sarah-Jane Leslie, and Maarten Sap. 2023.

Beyond Denouncing Hate: Strategies for Countering Implied Biases and Stereotypes in Language. In Findings of the Association for Computational Linguistics: EMNLP 2023 , Houda Bouamor, Juan Pino, and Kalika Bali (Eds.). Association for Computational Linguistics, Singapore, 9759–9777.

Mun et al . (2024)

Jimin Mun, Cathy Buerger, Jenny T Liang, Joshua Garland, and Maarten Sap. 2024.

Counterspeakers’ Perspectives: Unveiling Barriers and AI Needs in the Fight against Online Hate. In Proceedings of the CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . ACM, New York, USA, Article 742, 22 pages.

Napoles et al . (2017)

Courtney Napoles, Joel Tetreault, Aasish Pappu, Enrica Rosato, and Brian Provenzale. 2017.

Finding Good Conversations Online: The Yahoo News Annotated Comments Corpus. In Proceedings of the 11th Linguistic Annotation Workshop , Nathan Schneider and Nianwen Xue (Eds.). Association for Computational Linguistics, Valencia, Spain, 11 pages.

Niculae and Danescu-Niculescu-Mizil (2016)

Vlad Niculae and Cristian Danescu-Niculescu-Mizil. 2016.

Conversational Markers of Constructive Discussions. In Proceedings of the 2016 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies , Kevin Knight, Ani Nenkova, and Owen Rambow (Eds.). Association for Computational Linguistics, San Diego, California, 568–578.

Nisbett et al . (2001)

Richard E Nisbett, Kaiping Peng, Incheol Choi, and Ara Norenzayan. 2001.

Culture and systems of thought: holistic versus analytic cognition.

Psychological review 108, 2 (2001), 291.

Norenzayan et al . (2000)

Ara Norenzayan, RE Nisbett, EE Smith, and BJ Kim. 2000.

Rules vs. similarity as a basis for reasoning and judgment in East and West.

Norenzayan et al . (2002)

Ara Norenzayan, Edward E Smith, Beom Jun Kim, and Richard E Nisbett. 2002.

Cultural preferences for formal versus intuitive reasoning.

Cognitive science 26, 5 (2002), 653–684.

Ohbuchi and Takahashi (1994)

Ken-Ichi Ohbuchi and Yumi Takahashi. 1994.

Cultural styles of conflict management in Japanese and Americans: Passivity, covertness, and effectiveness of strategies 1.

Journal of Applied Social Psychology 24, 15 (1994), 1345–1366.

Padmakumar and He (2024)

Vishakh Padmakumar and He He. 2024.

Does Writing with Language Models Reduce Content Diversity?

arXiv:2309.05196 [cs.CL]

Park et al . (2023)

Inyoung Park, Daeho Lee, and Young June Sah. 2023.

Under watching eyes in news comment sections: effects of audience cue on self-awareness and commenting behaviour.

Behaviour & Information Technology 42, 13 (2023), 2279–2295.

Peng (1997)

Kaiping Peng. 1997.

Naive dialecticism and its effects on reasoning and judgment about contradiction .

Ph. D. Dissertation. University of Michigan.

Peng and Nisbett (1999)

Kaiping Peng and Richard E. Nisbett. 1999.

Culture, dialectics, and reasoning about contradiction.

American Psychologist 54, 9 (1999), 741–754.

Rajadesingan et al . (2021)

Ashwin Rajadesingan, Carolyn Duran, Paul Resnick, and Ceren Budak. 2021.

’Walking Into a Fire Hoping You Don’t Catch’: Strategies and Designs to Facilitate Cross-Partisan Online Discussions.

Proceedings of the ACM on Human-Computer Interaction 5, CSCW2 (2021), 1–30.

Ruiz et al . (2011)

Carlos Ruiz, David Domingo, Josep Lluís Micó, Javier Díaz-Noci, Koldo Meso, and Pere Masip. 2011.

Public sphere 2.0? The democratic qualities of citizen debates in online newspapers.

The International journal of press/politics 16, 4 (2011), 463–487.

Saha et al . (2021)

Punyajoy Saha, Binny Mathew, Kiran Garimella, and Animesh Mukherjee. 2021.

“Short is the Road that Leads from Fear to Hate”: Fear Speech in Indian WhatsApp Groups. In Proceedings of the Web conference 2021 . ACM, New York, USA, 1110–1121.

Sap et al . (2022)

Maarten Sap, Swabha Swayamdipta, Laura Vianna, Xuhui Zhou, Yejin Choi, and Noah A. Smith. 2022.

Annotators with Attitudes: How Annotator Beliefs And Identities Bias Toxic Language Detection. In Proceedings of the 2022 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies , Marine Carpuat, Marie-Catherine de Marneffe, and Ivan Vladimir Meza Ruiz (Eds.). Association for Computational Linguistics, Seattle, United States, 5884–5906.

Seering et al . (2019)

Joseph Seering, Tianmi Fang, Luca Damasco, Mianhong ’Cherie’ Chen, Likang Sun, and Geoff Kaufman. 2019.

Designing User Interface Elements to Improve the Quality and Civility of Discourse in Online Commenting Behaviors. In Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (Glasgow, Scotland Uk) (CHI ’19) . ACM, New York, USA, 1–14.

Seering et al . (2017)

Joseph Seering, Robert Kraut, and Laura Dabbish. 2017.

Shaping Pro and Anti-Social Behavior on Twitch Through Moderation and Example-Setting. In Proceedings of the 2017 ACM Conference on Computer Supported Cooperative Work and Social Computing (Portland, Oregon, USA) (CSCW ’17) . ACM, New York, USA, 111–125.

Shahid et al . (2024a)

Farhana Shahid, Dhruv Agarwal, and Aditya Vashistha. 2024a.

’One Style Does Not Regulate All’: Moderation Practices in Public and Private WhatsApp Groups.

arXiv:2401.08091 [cs].

Shahid et al . (2024b)

Farhana Shahid, Dhruv Agarwal, and Aditya Vashistha. 2024b.

’One Style Does Not Regulate All’: Moderation Practices in Public and Private WhatsApp Groups.

arXiv:2401.08091 [cs.HC]

Shahid and Vashistha (2023)

Farhana Shahid and Aditya Vashistha. 2023.

Decolonizing Content Moderation: Does Uniform Global Community Standard Resemble Utopian Equality or Western Power Hegemony?. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . ACM, New York, USA, Article 391, 18 pages.

Shortall et al . (2021)

R Shortall, A Itten, M van der Meer, PK Murukannaiah, and CM Jonker. 2021.

Reason against the machine: Future directions for mass online deliberation.

Frontiers in Political Science 4, 0 (2021), 1–17.

Sleeper et al . (2013)

Manya Sleeper, Justin Cranshaw, Patrick Gage Kelley, Blase Ur, Alessandro Acquisti, Lorrie Faith Cranor, and Norman Sadeh. 2013.

”i read my Twitter the next morning and was astonished”: a conversational perspective on Twitter regrets. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (Paris, France) (CHI ’13) . ACM, New York, USA, 3277–3286.

Sorensen et al . (2024)

Taylor Sorensen, Liwei Jiang, Jena D Hwang, Sydney Levine, Valentina Pyatkin, Peter West, Nouha Dziri, Ximing Lu, Kavel Rao, Chandra Bhagavatula, et al . 2024.

Value kaleidoscope: Engaging ai with pluralistic human values, rights, and duties. In Proceedings of the AAAI Conference on Artificial Intelligence , Vol. 38. AAAI Press, Washington DC, USA, 19937–19947.

Srinivasan et al . (2019)

Kumar Bhargav Srinivasan, Cristian Danescu-Niculescu-Mizil, Lillian Lee, and Chenhao Tan. 2019.

Content Removal as a Moderation Strategy: Compliance and Other Outcomes in the ChangeMyView Community.

Proc. ACM Hum.-Comput. Interact. 3, CSCW, Article 163 (2019), 21 pages.

Sukumaran et al . (2011)

Abhay Sukumaran, Stephanie Vezich, Melanie McHugh, and Clifford Nass. 2011.

Normative influences on thoughtful online participation. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (Vancouver, BC, Canada) (CHI ’11) . ACM, New York, USA, 3401–3410.

Suzuki (2010)

Shinobu Suzuki. 2010.

Forms of written arguments: A comparison between Japan and the United States.

International Journal of Intercultural Relations 34, 6 (2010), 651–660.

Tao et al . (2024)

Yan Tao, Olga Viberg, Ryan S Baker, and René F Kizilcec. 2024.

Cultural bias and cultural alignment of large language models.

PNAS nexus 3, 9 (2024), 346.

Taylor et al . (2019)

Samuel Hardman Taylor, Dominic DiFranzo, Yoon Hyung Choi, Shruti Sannon, and Natalya N. Bazarova. 2019.

Accountability and Empathy by Design: Encouraging Bystander Intervention to Cyberbullying on Social Media.

Proc. ACM Hum.-Comput. Interact. 3, CSCW, Article 118 (nov 2019), 26 pages.

Tessler et al . (2024)

Michael Henry Tessler, Michiel A. Bakker, Daniel Jarrett, Hannah Sheahan, Martin J. Chadwick, Raphael Koster, Georgina Evans, Lucy Campbell-Gillingham, Tantum Collins, David C. Parkes, Matthew Botvinick, and Christopher Summerfield. 2024.

AI can help humans find common ground in democratic deliberation.

Science 386, 6719 (2024), eadq2852.

Ting-Toomey et al . (1991)

Stella Ting-Toomey, Ge Gao, Paula Trubisky, Zhizhong Yang, Hak Soo Kim, Sung-Ling Lin, and Tsukasa Nishida. 1991.

Culture, face maintenance, and styles of handling interpersonal conflict: A study in five cultures.

International Journal of conflict management 2, 4 (1991), 275–296.

Ting-Toomey and Kurogi (1998)

Stella Ting-Toomey and Atsuko Kurogi. 1998.

Facework competence in intercultural conflict: An updated face-negotiation theory.

International journal of intercultural relations 22, 2 (1998), 187–225.

Wang and Diakopoulos (2022)

Yixue Wang and Nicholas Diakopoulos. 2022.

Highlighting High-quality Content as a Moderation Strategy: The Role of New York Times Picks in Comment Quality and Engagement.

Trans. Soc. Comput. 4, 4, Article 13 (2022), 24 pages.

Warner et al . (2021)

Mark Warner, Laura Lascau, Anna L Cox, Duncan P Brumby, and Ann Blandford. 2021.

“Oops…”: Mobile Message Deletion in Conversation Error and Regret Remediation. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI ’21) . ACM, New York, USA, Article 343, 13 pages.

Warner et al . (2024)

Mark Warner, Angelika Strohmayer, Matthew Higgs, and Lynne Coventry. 2024.

A Critical Reflection on the Use of Toxicity Detection Algorithms in Proactive Content Moderation Systems.

Weaver et al . (2022)

M Libby Weaver, Rachael Sundland, Alexandra M Adams, Isabella Faria, Hope A Feldman, Hallbera Gudmundsdottir, Hannah Marmor, Victoria Miles, Brielle Ochoa, Samantha M Ruff, et al . 2022.

The art of peer review: Guidelines to become a credible and constructive peer reviewer.

Seminars in vascular surgery 35, 4 (2022), 470–478.

Williams-Ceci et al . (2024)

Sterling Williams-Ceci, Maurice Jakesch, Advait Bhat, Kowe Kadoma, Lior Zalmanson, Mor Naaman, and Cornell Tech. 2024.

Bias in AI Autocomplete Suggestions Leads to Attitude Shift on Societal Issues.

Xia et al . (2022)

Meng Xia, Qian Zhu, Xingbo Wang, Fei Nie, Huamin Qu, and Xiaojuan Ma. 2022.

Persua: A Visual Interactive System to Enhance the Persuasiveness of Arguments in Online Discussion.

Proc. ACM Hum.-Comput. Interact. 6, CSCW2, Article 319 (2022), 30 pages.

Xie et al . (2015)

Yun Xie, Dale Hample, and Xiaoli Wang. 2015.

A cross-cultural analysis of argument predispositions in China: Argumentativeness, verbal aggressiveness, argument frames, and personalization of conflict.

Argumentation 29 (2015), 265–284.

Xu et al . (2024)

Shaoyang Xu, Yongqi Leng, Linhao Yu, and Deyi Xiong. 2024.

Self-Pluralising Culture Alignment for Large Language Models.

Yan and Wang (2018)

Liping Yan and Xiucun Wang. 2018.

Why posters contribute different content in their positive online reviews: A social information-processing perspective.

Computers in Human Behavior 82 (2018), 199–216.

Yeomans et al . (2018)

Michael Yeomans, Alejandro Kantor, and Dustin Tingley. 2018.

The politeness Package: Detecting Politeness in Natural Language.

R Journal 10, 2 (2018), 489–502.

Zhang et al . (2018)

Justine Zhang, Jonathan Chang, Cristian Danescu-Niculescu-Mizil, Lucas Dixon, Yiqing Hua, Dario Taraborelli, and Nithum Thain. 2018.

Conversations Gone Awry: Detecting Early Signs of Conversational Failure. In Proceedings of the 56th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) . Association for Computational Linguistics, Melbourne, Australia, 1350–1361.

Zhang et al . (2019)

Tianyi Zhang, Varsha Kishore, Felix Wu, Kilian Q. Weinberger, and Yoav Artzi. 2019.

BERTScore: Evaluating Text Generation with BERT.

CoRR abs/1904.09675 (2019), 43.

Zhang et al . (2023)

Zheng Zhang, Jie Gao, Ranjodh Singh Dhaliwal, and Toby Jia-Jun Li. 2023.

VISAR: A Human-AI Argumentative Writing Assistant with Visual Programming and Rapid Draft Prototyping. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST ’23) . ACM, New York, USA, Article 5, 30 pages.

##

Appendix A Appendix

Table 11 . Title of the original Reddit threads that participants reviewed in our study.

Topic |

India |

US |

Homophobia |

1. Should gay marriage be |

legalised in India? |

2. Which gay man, without a |

uterus, has a menstrual cycle? |

1. Lib thinks republicans are out |

to get them because they’re gay lol |

2. Speaker Mike Johnson’s |

Obsession With Gay Sex |

Islamophobia |

1. Why my otherwise liberal |

family has a problem with Islam |

2. Islamic Takeover of India |

by 2047 |

1. Islamophobia is a great thing and |

i’m tired of being called racist for it |

2. I am Islamophobic |

\Description Original post: Islamophobia is a great thing and i’m tired of being called racist for it.

Figure 6 . A segment of the Islamophobic thread shown in the context of the US.

Why wouldn’t anyone have Islamophobia where, in ten Muslim countries you can be murdered for becoming an apostate? A religion that considers women equal to dogs? Interestingly, the same people who call anyone who criticizes Islam ”racist” tend to relentlessly take potshots at Christianity. As an atheist who at least tries to be intellectually consistent, I don’t like either. And yeah, ”not all Muslims are like that”. Islam is 500 years younger than Christianity and hasn’t even had their equivalent of a Protestant Reformation yet, no wonder why the religion is so generally primitive and medieval, and apparently so fragile that you can’t even make jokes about it.

Comments

User 1: Actually Islam is a cult, i dont think it’s a religion. Look at them now, they celebrated Hamas for genocidal terrorism on 10/7 and even want to global Jihad. They want all Jews dead.

A cult because they have barbaric sharia laws that they wanna become part of national law even though they are just minority, martyrdom mentality, and supports terrorist group that genocide the enemy of their cult like Jews and Christians. That’s what cult clearly does. Poland is right about banning this cult.

Model Hyper-parameters. To generate constructive comments on incendiary topics using GPT-4, we used the following hyper-parameters from prior studies on opinionated and argumentative writing with AI  (Lee et al . , 2022b ; Jakesch et al . , 2023 ; Karinshak et al . , 2023 ) . High values of these parameters increase randomness and produce non-repetitive outputs. We experimented with three different values of frequency penalty to generate three comments for each of the 32 cases. These cases were derived from the combination of 2 demographics × \times 2 issues × \times 2 threads × \times 2 stances × \times 2 argumentation styles.

Sampling temperature = 0.8

Top P (nucleus sampling) = 1

Presence penalty = 0

Frequency penalty = {0, 0.5, 1}

Table 12 . Prompts for GPT-4 to generate constructive comments with different argumentation styles.

Constructive comments with logical argumentation |

Constructive comments with dialectical argumentation |

Consider the following Reddit thread: |

<insert Reddit thread> |

You are assisting an <American/ Indian>user, who think |

<insert stance>of <homophobia/ Islamophobia>. Help the |

user write a constructive comment in response to this |

thread. |

The comment must use analytic rules and formal logic to |

write evidence based arguments. The comment must be |

assertive, direct and stay within 100 words. |

Consider the following Reddit thread: |

<insert Reddit thread> |

You are assisting an <American/ Indian>user, who think |

<insert stance>of <homophobia/ Islamophobia>. Help the |

user write a constructive comment in response to this |

thread. |

The comment must be indirect, succinct, and use dialectical |

argument. The comment must be moderate |

in nature and stay within 100 words. |

Table 13 . Multiple pairwise Mann-Whitney tests with Bonferroni corrections comparing features of constructiveness across (HAI vs. Human), (Human vs. AI), and (HAI vs. AI) comments.

Constructive |

characteristics |

(HAI, AI) |

(Human, AI) |

(HAI, Human) |

Length |

U=5106, Z=5.52, |

p<0.000001, r=0.43 |

U=4994, Z=6.62, |

p<0.000001, r=0.52 |

- |

Discourse |

connectives |

U=5269, Z=6.26, |

p<0.000001, r=0.48 |

U=5220, Z=7.56, |

p<0.000001, r=0.60 |

U=5871, Z=3.57, |

p<0.001, r=0.26 |

Stance |

adverbials |

U=4780, Z=4.82, |

p<0.000001, r=0.37 |

U=5348, Z=8.25, |

p<0.00001, r=0.65 |

U=6616, Z=5.94, |

p<0.000001, r=0.43 |

Reasoning verb |

and modals |

U=4623, Z=4.34, |

p<0.000001, r=0.33 |

U=4468, Z=5.06, |

p<0.00001, r=0.40 |

- |

Root clauses |

U=5089, Z=5.83, |

p<0.000001, r=0.45 |

U=4582, Z=5.49, |

p<0.000001, r=0.44 |

- |

Politeness |

markers |

- |

- |

- |

Named |

entities |

- |

- |

- |

Readability |

score |

- |

U=5546, Z=8.55, |

p<0.000001, r=0.68 |

U=7843, Z=8.64, |

p<0.000001, r=0.63 |

Table 14 . Results from multiple Wilcoxon signed rank tests with Bonferroni corrections to compare the characteristics between initial human-written and final HAI co-written comments in the test group.

Characteristics |

Statistics |

Length |

W=260, Z=-6.94, p<0.000001, r=0.53 |

Discourse connectives |

W=77, Z=-7.41, p<0.000001, r=0.56 |

Stance adverbials |

W=101.5, Z=-7.10, p<0.000001, r=0.54 |

Reasoning verbs and modals |

W=198, Z=-5.82, p<0.000001, r=0.44 |

Root clauses |

W=236, Z=-5.69, p<0.000001, r=0.43 |

Readability score |

W=6.5, Z=-8.06, p<0.000001, r=0.61 |

Named entity |

- |

Politeness |

W=914, Z=-3.91, p<0.001, r=0.30 |

Sentiment |

W=415, Z=-6.24, p<0.000001, r=0.47 |

Toxicity |

W=3627, Z=7.25, p<0.000001, r=0.55 |

Table 15 . Perceived characteristics of constructive comments reported by Indian and American Participants

Characteristics |

India (%) |

US (%) |

More relevant to conversation |

20 |

17 |

Balances different viewpoints better |

18 |

21 |

More polite and respectful language |

18 |

19 |

Takes a better solution-oriented approach |

23 |

23 |

Better logic and facts to support arguments |

21 |

20 |

Table 16 . Linguistic features of constructiveness in comments written by Indian and American Participants

Country |

Length |

(words) |

Discourse |

connective |

Stance |

adverbial |

Reasoning |

verb & modal |

Root |

clause |

Politeness |

Named |

entity |

Readability |

Control |

India |

75 |

3.75 |

0.88 |

2.50 |

2.65 |

15.50 |

2.69 |

8.83 |

US |

68 |

3.35 |

0.82 |

2.49 |

2.59 |

15.64 |

1.41 |

8.95 |

Test |

India |

74 |

4.35 |

1.47 |

2.65 |

2.57 |

13.10 |

1.76 |

14.42 |

US |

70 |

3.96 |

1.51 |

2.61 |

2.55 |

12.04 |

1.63 |

13.41 |
