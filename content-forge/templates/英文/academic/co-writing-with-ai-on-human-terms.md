---
title: "Co-Writing with AI, on Human Terms: Aligning Research with User Demands Across the Writing Process"
source: "ar5iv/arXiv"
url: "https://ar5iv.labs.arxiv.org/html/2504.12488"
author: "arXiv authors"
type: "academic_preprint"
language: "en"
template_kind: "academic_reference"
license_note: "Open full-text web source; saved locally for style-analysis reference."
---
# Co-Writing with AI, on Human Terms: Aligning Research with User Demands Across the Writing Process

> Source: https://ar5iv.labs.arxiv.org/html/2504.12488

# Co-Writing with AI, on Human Terms: Aligning Research with User Demands Across the Writing Process

Mohi Reza

0000-0001-9668-3384

University of Toronto Toronto Ontario Canada

mohireza@cs.toronto.edu

Jeb Thomas-Mitchell

University of Toronto Toronto Ontario Canada

mohireza@cs.toronto.edu

Peter Dushniku

0009-0002-3789-4629

University of Toronto Toronto Ontario Canada

peter.dushniku@mail.utoronto.ca

Nathan Laundry

0000-0003-0846-2472

University of Toronto Toronto Ontario Canada

nathan.laundry@mail.utoronto.ca

Joseph Jay Williams

0000-0002-9122-5242

University of Toronto 40 St George St. Toronto Ontario Canada M5S 2E4

williams@cs.toronto.edu

and

Anastasia Kuzminykh

0000-0002-5941-4641

University of Toronto Toronto Ontario Canada

anastasia.kuzminykh@utoronto.ca

(2018)

Abstract.

As generative AI tools like ChatGPT become integral to everyday writing, critical questions arise about how to preserve writers’ sense of agency and ownership when using these tools. Yet, a systematic understanding of how AI assistance affects different aspects of the writing process–and how this shapes writers’ agency–remains underexplored. To address this gap, we conducted a systematic review of 109 HCI papers using the PRISMA approach. From this literature, we identify four overarching design strategies for AI writing support– structured guidance , guided exploration , active co-writing , and critical feedback –mapped across the four key cognitive processes in writing: planning , translating , reviewing , and monitoring . We complement this analysis with interviews of 15 writers across diverse domains. Our findings reveal that writers’ desired levels of AI intervention vary across the writing process: content-focused writers (e.g., academics) prioritize ownership during planning , while form-focused writers (e.g., creatives) value control over translating and reviewing . Writers’ preferences are also shaped by contextual goals, values, and notions of originality and authorship. By examining when ownership matters, what writers want to own, and how AI interactions shape agency, we surface both alignment and gaps between research and user needs. Our findings offer actionable design guidance for developing human-centered writing tools for co-writing with AI, on human terms.

† † copyright: acmlicensed † † journalyear: 2018 † † doi: XXXXXXX.XXXXXXX † † journal: PACMHCI † † publicationmonth: 8 † † conference: Proceedings of the ACM on Human-Computer Interaction; October 18–22, 2025; Bergen, Norway † † journalyear: 2025 † † doi: 10.1145/XXXXXXX.XXXXXXX † † ccs: Information systems Systematic reviews † † ccs: Human-centered computing Collaborative and social computing † † ccs: Computing methodologies Artificial intelligence Natural language processing † † ccs: Human-centered computing Interaction design Empirical studies in HCI

Figure 1 . Research Overview: We present two interrelated qualitative studies exploring how to design for human agency in Human-AI Collaborative writing . (1) Study 1 : A systematic review and thematic analysis of 109 papers (2018–2024), filtered from over 1,600 records in the Human-AI collaborative writing literature using the PRISMA methodology; (2) Study 2 : A semi-structured interview study with 15 writers representing diverse writing genres, AI familiarity levels, and experience with generative AI tools.

##

1. Introduction

As Large Language Models (LLMs) grow more powerful and pervasive, AI tools like ChatGPT have become integral to the modern writing process. Computers are evolving from mere tools to collaborative companions , raising concerns about the encroachment of writers’ co-creative boundaries (Biermann et al., 2022 ) , eroding their agency and ownership over the writing process (Lee et al., 2024 , 2022 ) . At the same time, AI tools have proven to be remarkably helpful to writers, augmenting their capabilities across the composition gamut ranging from brainstorming and ideation (Shaer et al., 2024 ; Si et al., 2024 ) , to editing and revision (Reza et al., 2024 ; Laban et al., 2024 ) –and everything in-between (Mollick and Mollick, 2024 ) –making it impractical to abandon this technology altogether.

One way to address the tension between ensuring human control and increasing automation (Shneiderman, 2022 ) is to examine how existing and proposed AI-assisted writing systems in the Human-AI collaborative writing literature support distinct cognitive processes in writing (Flower and Hayes, 1981 ) , and whether that support encroaches on what writers consider to be central to preserving their sense of agency (i.e., their

perception of control and autonomy over the writing process), ownership (i.e., their feeling of

personal investment in and attribution of the final text), and task delegation (i.e., their choice about which writing subtasks to assign to AI, based on which cognitive processes they consider essential). Writers must maintain agency over the cognitive processes they value most through careful task delegation in order to preserve their sense of ownership over the final text. However, despite the unprecedented pace at which the AI-assisted writing research has grown over the past few years, there is currently no systematic understanding of what cognitive processes are being supported in numerous AI-assisted writing tools, what strategies are being used to offer that support, and how those strategies align with user perspectives across different forms of writing. Furthermore, these strategies have largely been evaluated from a usability and efficiency perspective (Binns et al., 2018 ) , treating writing as a single task centered on optimization, with limited attention to preserving human agency through effective human-AI collaboration (Amershi et al., 2019 ) and across its distinct cognitive processes (Flower and Hayes, 1981 ) .

In this work, we explore whether recent research on Human-AI collaborative writing aligns with user needs, shifting the focus away from output-oriented concerns like productivity toward human-centered considerations–particularly how to preserve writers’ sense of agency and ownership when collaborating with AI. To investigate this, we ask two research questions:

RQ1: What design strategies are used or suggested in existing AI-assisted writing research, particularly in terms of interaction models and the intended use of AI outputs, and how are these strategies distributed across writing processes and writing contexts?

RQ2: Which cognitive processes do writers consider essential to control in order to maintain their sense of agency during AI-assisted writing, and how do user situations, writing contexts, and AI interaction types shape their perceptions of ownership?

To answer RQ1, we conducted a systematic review and meta-analysis of 1,676 papers in the Human-AI collaborative writing space from 2018-2024. We first analyze the systems developed or proposed in recent Human-AI collaborative writing literature, then classify them according to distinct thinking processes involved during composition, as outlined in Flower and Hayes cognitive process theory of writing (Flower and Hayes, 1981 ) . Then, to answer RQ2, we interviewed 15 writers across diverse domains, exploring how AI affects their sense of control and creative ownership across different writing processes. We then synthesized findings from both studies, revealing encouraging alignments as well as notable gaps between current AI writing support systems and writers’ expressed needs. Figure 1 provides an overview of our research approach.

Our synthesis offers actionable guidance for designers, highlighting specific areas and methods of AI support that prioritize user agency. Rather than supporting all aspects of writing indiscriminately, our work helps focus design efforts on features that meaningfully preserve writers’ sense of control and ownership. Grounded in these findings, our contributions to the CSCW Human-Centered AI community include:

The first comprehensive study on designing for human agency in AI-assisted writing, combining a systematic review of post-generative AI research with a user-centered analysis of how writers seek to preserve ownership and originality.

A detailed characterization of four overarching design strategies for AI writing support, grounded in writers’ perspectives on when ownership matters, what they want to own, and how AI interactions shape that ownership.

Actionable design guidance for CSCW and HCI researchers developing AI writing tools, including concrete recommendations for supporting writer agency across the cognitive processes of writing. Our work informs future systems that foreground meaningful human-AI collaboration, rather than automation alone.

##

2. Background & Related Work

This section provides the theoretical and empirical foundation for our study. We begin by justifying our selection of the Flower and Hayes cognitive process model as our analytical lens. We then review the evolution of AI-assisted writing systems, followed by a discussion of how these systems affect writers’ sense of agency and ownership over the writing process.

###

2.1. Theories on Writing Processes

Early conceptualizations of writing processes by Rohman (Rohman, 1965 ) focused on the temporal evolution of written documents. Rohman introduced a three-stage model emphasizing ”pre-writing” – the preparatory phase where writers engage in thinking and analysis to discover patterns in their subject matter. This stage, followed by ”writing” and ”re-writing,” was seen as essential for producing what Rohman termed ”good writing” (i.e., text that makes original and insightful contributions). While groundbreaking, this linear approach would later be challenged by more dynamic models.

Flower and Hayes (Flower and Hayes, 1981 ) reconceptualized writing as a set of cognitive processes that writers deploy dynamically rather than in temporal stages. Their model identifies four primary processes: planning (i.e., constructing internal representations of knowledge through generating ideas, organizing ideas, and goal-setting), translating (i.e., transforming structured information into linear prose), reviewing (i.e., evaluating and revising text according to established goals), and monitoring (i.e., overseeing, regulating, and coordinating the writer’s cognitive activities, such as deciding when to shift between planning, translating, and reviewing, and ensuring alignment with writing goals). These processes operate within a task environment that includes the rhetorical problem and the emerging text, drawing upon the writer’s long-term memory for topic knowledge and audience awareness. The processes form a hierarchical network where writers can move between processes at any time, or between high-level and local operational goals.

Nystrand (NYSTRAND, 1989 ) expanded the theoretical landscape by incorporating social dimensions into writing process analysis. His framework emphasizes writing as a communicative event where meaning is actively constructed between writer and reader within discursive communities. Nystrand argued that skilled writers anticipate readers’ expectations and manipulate their text to establish a temporarily-shared social reality. Hayes and Nash (Hayes and Nash, 1996 ) detailed the cognitive architecture of planning, including planning by abstraction, analogy, and modeling. Kellogg (KELLOGG, 1987 ) explored the role of working memory in writing processes, while Hayes (Hayes, 1996 ) expanded the original Flower and Hayes model to encompass social and physical environments, affect, and motivation. These contributions added depth to specific aspects of the writing process while building upon earlier foundational frameworks.

Our analysis employs the Flower and Hayes (1981) model as our primary theoretical lens for several reasons. First, it provides a comprehensive process model that describes writing behaviours. Second, its processes provide an analytical framework sufficient for examining the collaborative writing process between humans and AI systems. While Nystrand’s model analyzes the social relationship between writer and reader, our research focuses on the collaborative interactions during writing, i.e. how humans and AI jointly engage in planning, translating, reviewing, and monitoring processes. The Flower and Hayes model allows us to examine how these cognitive processes are distributed and negotiated between human writers and AI systems during composition. Compared to other writing process theories, the Flower and Hayes model maintains an optimal balance between sophistication and analytical utility for our specific research context.

###

2.2. AI-Assisted Writing

Research on AI-assisted writing systems traces back to early implementations focused on creative writing support. Pre-transformers (Vaswani et al., 2017 ) systems like Creative Help (Roemmele and Gordon, 2015 ) and Say Anything (Swanson and Gordon, 2012 ) utilized case-based reasoning and story repositories to generate context-aware sentence suggestions. Clark’s (Clark et al., 2018 ) work examining user experiences with AI writing prototypes revealed that while participants found AI collaboration satisfying, the resulting text quality did not surpass that of unaided human writers. These early systems laid the groundwork for understanding both the potential and limitations of AI writing assistance.

The emergence of transformer-based large language models in 2017 catalyzed research into AI writing assistance. In creative writing, researchers have developed systems supporting story writing (Yuan et al., 2022 ) , playwriting (Mirowski et al., 2023 ) , and character development (Qin et al., 2024 ; Schmitt and Buschek, 2021 ) . New systems support higher-level writing tasks such as prewriting (Wan et al., 2024 ) , and generating perspective-specific feedback (Benharrak et al., 2024 ) . Specialized creative applications have emerged for tasks including metaphor generation (Kim et al., 2023b ) , collaborative storytelling (Nichols et al., 2020 ) , and personal diary writing (Kim et al., 2024b ) as well as auxiliary creative tasks such as caption generation (Kariyawasam et al., 2024 ) , title creation (Osone et al., 2021 ) , and writing reflective summaries (Dang et al., 2022 ) . Technical writing applications have focused on enhancing accessibility and supporting specialized writing tasks, including peer review (Wambsganss et al., 2022 ) , literature reviews (Choe et al., 2024 ) , and writing support for users with dyslexia or stuttering (Ghai and Mueller, 2021 ; Goodman et al., 2022 ) .

User studies reveal complex dynamics in how writers interact with and perceive AI writing assistance. At a system interaction level, the design of AI suggestions significantly impacts user behaviour and output: sentence-level suggestions promote original content creation, while paragraph-level suggestions improve efficiency (Fu et al., 2023 ) . Writers’ engagement with AI assistance is also influenced by their personal values and goals. Writers show varying receptivity to AI support based on their confidence levels, demonstrating higher acceptance in areas where they lack expertise (Biermann et al., 2022 ) , and their desires for support are closely tied to their perception of support actors and personal values (Gero et al., 2023 ) . Moreover, this human-AI writing relationship raises important concerns. Studies by Jakesch et al. (Jakesch et al., 2023 ) and Poddar et al. (Poddar et al., 2023 ) reveal that biased AI models can influence not only the resulting text but also users’ own opinions. While users often value AI writing assistance highly, particularly for creative tasks (Li et al., 2024 ) , professional writers note persistent challenges with AI systems’ ability to maintain consistent style and voice (Ippolito et al., 2022 ) . These findings highlight a central tension: as AI writing systems become more sophisticated, they must balance providing assistance while preserving authenticity and agency.

###

2.3. Agency and Ownership in AI-Assisted Writing

Recent research has examined how AI writing assistance affects users’ sense of agency (i.e., their perception of control and autonomy over the writing process) and ownership (i.e., their feeling of personal investment in and attribution of the final text). Studies have shown that writers’ sense of agency is significantly impacted by the level and type of AI intervention in the writing process. Robertson et al. (Robertson et al., 2021 ) found that autocomplete suggestions could threaten users’ autonomy. Similarly, Dhillon et al.’s (Dhillon et al., 2024 ) research demonstrated that while next-paragraph suggestions improved writing quality, longer AI text completions decreased satisfaction by undermining writers’ independence. This finding aligns with Draxler et al.’s work (Draxler et al., 2024a ) , which showed that increased AI support corresponded with decreases in users’ perceived control.

The relationship between AI assistance and text ownership is influenced by multiple factors, particularly professional context and writing purpose. Lee et al. (Lee et al., 2022 ) identified a direct correlation between self-reported ownership and the proportion of user-written versus AI-generated text. Biermann et al. (Biermann et al., 2022 ) found that storywriters who emphasized the expressive and emotional value of writing insisted on maintaining direct control over translation, viewing this control as essential to preserving their writerly identity and integrity. Gero et al.’s research (Gero et al., 2023 ) revealed that the idea generation phase can particularly threaten ownership, with some writers considering the struggle with writer’s block as integral to their writerly identity.

Several studies have identified factors that influence users’ sense of agency and ownership in AI writing systems. Kobiella et al (Kobiella et al., 2024 ) found that participants who viewed AI as an enhancement tool rather than a replacement reported stronger feelings of accomplishment and ownership, while those who perceived their contributions as minimal experienced diminished ownership. Rezwana et al.’s (Rezwana and Maher, 2023 ) work highlighted that ownership perceptions depend on both contribution levels and leadership in the writing process, suggesting that interaction designs that maximize user agency can enhance ownership. These findings indicate that maintaining user agency and ownership requires careful consideration of interaction design, user control mechanisms, and the balance between AI support and user autonomy.

These investigations have demonstrated the need for continued focus on users’ senses of agency and ownership when writing with AI. However, there are currently no broad reviews of the AI-assisted writing research landscape that have evaluated HCI researchers’ and system designers’ strategies against users’ needs for preserving their agency and ownership throughout their writing process.

##

3. Study 1: Reviewing Writing Process Dimensions in the Literature

To answer RQ1: “What design strategies are used or suggested in existing AI-assisted writing research, particularly in terms of interaction models and the intended use of AI outputs, and how are these strategies distributed across writing processes and writing contexts?”, we conducted a PRISMA systematic literature review on the ACM Digital Library database, and coded the resulting paper dataset, guided by the Flower & Hayes Cognitive Process Theory of Writing (Flower and Hayes, 1981 ) and writing contexts, interfaces, and interactions enumerated by Lee et al. (Lee et al., 2024 ) . We then performed thematic analysis (Braun et al., 2023 ) on the coded dataset in order to identify design strategies characterized by different interaction models, levels of AI support, and treatment of AI outputs. Finally, we coded the systems in our dataset by strategy in order to determine the distribution of the strategies across writing processes and contexts.

###

3.1. Methods

We conducted a systematic literature review following PRISMA guidelines (Page et al., 2021 ) to identify and analyze research on AI writing support systems. PRISMA ( P referred R eporting I tems for S ystematic R eviews and M eta- A nalyses) is a series of systematic review guidelines that are intended to improve the reporting and replicability of scientific literature reviews and meta-analyses. Our review focused on papers published between 2018-2024, corresponding to the emergence and widespread adoption of transformer-based language models (Vaswani et al., 2017 ) . This period is marked by the explosion of AI research in HCI, visible in the publishing dates of papers in our dataset 2(a) .

####

3.1.1. Query Construction

We developed our search query through an iterative process, beginning with a set of seed papers and expert knowledge in the field. We expanded our initial keyword list through multiple refinement cycles. The final search query combined writing-related terms with AI-related terms in order to capture as many potentially-relevant papers as possible:

("writing" OR "writer" OR "write" OR "collaborative" OR "collaboration"

OR "collaborate" OR "collaborating" OR "author" OR "authors" OR

"creativity support" OR "co-creation" OR "co-writing") AND

("AI" OR "language model" OR "artificial intelligence" OR "generative"

OR "chatbot" OR "natural language processing" OR "NLP" OR "LLM" OR

"digital assistant")

####

3.1.2. Exclusion Criteria

We limited our review to peer-reviewed papers published in English, including journal papers, conference proceedings, and extended abstracts. We developed four primary exclusion criteria:

EC1.

Papers where AI interaction is not providing AI-assisted writing support, defined as AI writing with a user to create a natural language written artifact.

EC2.

Papers presenting purely technical, backend, or algorithmic contributions without user interaction.

EC3.

Papers focusing on non-natural language output formats (i.e., code or images exclusively).

EC4.

Papers that did not present a user study, artifact or system contribution, theory or conceptual framework, or systematic review.

####

3.1.3. Database Selection

To determine the optimal database for our review, we conducted a preliminary analysis across multiple digital libraries. We systematically sampled 100 papers from each of ACM Digital Library, IEEE Xplore, Taylor & Francis, and Wiley by using a random sampling to select papers from search results for our query with 2018-2024 publication dates. We then applied our exclusion criteria to these papers’ titles and abstracts. This preliminary assessment was designed to evaluate the concentration of relevant literature across databases. The ACM Digital Library yielded significantly more relevant results (11%) compared to IEEE (2%), Taylor & Francis (3%), and Wiley (3%). Given this substantially higher concentration of relevant publications, we determined that the ACM Digital Library would provide the most comprehensive and targeted corpus of literature addressing our research questions.

(a) Distribution of papers by year, color-coded by HCI contribution type, highlighting the rapid growth of AI-assisted writing research following the introduction of transformer-based language models.

(b) PRISMA flowchart illustrating the paper selection process for Study 1, including identification, screening, eligibility, and inclusion of 109 papers from an initial set of 1,676 records.

Figure 2 . Study overview: distribution of selected papers and paper selection process.

####

3.1.4. Screening Process

Our initial search yielded 1,676 papers. One researcher conducted the initial screening, applying our exclusion criteria to titles and abstracts, which identified 219 papers for full-text review. To ensure reliable coding, we conducted an inter-rater reliability test on a random sample of 25 papers from this set. Two researchers independently coded these papers based on the full text, achieving a Cohen’s kappa of 0.84, indicating strong agreement (McHugh, 2012 ) . We resolved disagreements through discussion and consensus with a third researcher.

Following the confirmation of inter-rater reliability, we divided the remaining papers between two researchers for independent full-text review. This process resulted in the exclusion of 110 papers: 71 for not providing co-writing support (criterion 1), 10 for purely technical contributions (criterion 2), 15 for non-natural language output (criterion 3), and 14 for not meeting our paper type criteria (criterion 4). Our final dataset comprised 109 papers. 2(b) provides an overview of the paper selection process.

####

3.1.5. Analysis

We employed a codebook thematic analysis approach, developing our initial codes from Flower & Hayes’ cognitive process model (Flower and Hayes, 1981 ) and Lee et al.’s design space framework (Lee et al., 2024 ) . This complete codebook can be found under our supplementary materials. Following King & Brooks (King and Brooks, 2017 ) and Braun & Clarke (Braun et al., 2023 ) we established our coding framework early in the process allowing us to inductively identify rich qualitative themes from the data.

###

3.2. Study 1 Findings

We first describe how writing support in the literature varies across five writing contexts, highlighting differences in the goals, users, and processes emphasized in each. We then introduce four overarching design strategies that characterize how systems support writers across these contexts, each with distinct implications for agency, task delegation, and interaction design.

Cognitive Processes |

Writing Contexts |

Academic

Creative

Formal

Personal

General

Planning |

Generating |

(Neshaei et al., 2024 ; Singh et al., 2024b ; Choe et al., 2024 ; Buruk, 2023 ; Shibani et al., 2024 ; Shaer et al., 2024 )

(Osone et al., 2021 ; Kreminski et al., 2020 ; Lee et al., 2022 ; Clark et al., 2018 ; Schmitt and Buschek, 2021 ; Gero and Chilton, 2019 ; Peng et al., 2023 ; Ram et al., 2021 ; Wang et al., 2022 ; Chung et al., 2022 ; Yuan et al., 2022 ; Mirowski et al., 2023 ; Nichols et al., 2020 ; Shakeri et al., 2021 ; Kariyawasam et al., 2024 ; Qin et al., 2024 ; Ghajargar et al., 2022 ; Dang et al., 2023 ; Biermann et al., 2022 ; Inie et al., 2023 ; Gero et al., 2023 ; Singh et al., 2023 ; Tholander and Jonsson, 2023 ; Booten and Gero, 2021 ; Li et al., 2024 ; Wan et al., 2024 ; Kim et al., 2024a ; Hupont et al., 2024 )

(Kim et al., 2023b ; Gero et al., 2022 ; Arakawa et al., 2023 ; Fu et al., 2023 ; Bhat et al., 2023 ; Ding et al., 2023 ; Guo et al., 2024 )

(Arakawa et al., 2023 ; Lee et al., 2022 ; Shin et al., 2022 ; Wang et al., 2022 ; Zhang et al., 2023b ; Cremaschi et al., 2023 ; Dhillon et al., 2024 ; Cai et al., 2024 ; Janaka et al., 2024 ; Kim et al., 2024b ; Li et al., 2024 )

(Chen et al., 2019 ; Gero and Chilton, 2019 ; Lehmann et al., 2022 ; Buschek et al., 2021 ; Di Fede et al., 2022 ; Cremaschi et al., 2023 ; Bhat et al., 2023 ; Suh et al., 2024 ; Reza et al., 2024 )

Organizing |

(Dang et al., 2022 ; Afrin et al., 2021 ; Resch and Yankova, 2019 ; Taiye et al., 2024 ; Sun et al., 2024 ; Choe et al., 2024 ; Shibani et al., 2024 ; Shaer et al., 2024 ; Wang et al., 2024 )

(Kreminski et al., 2020 ; Schmitt and Buschek, 2021 ; Wang et al., 2022 ; Chung et al., 2022 ; Yuan et al., 2022 ; Xu et al., 2024 ; Ghajargar et al., 2022 ; Kim et al., 2023a ; Biermann et al., 2022 ; Jahanbakhsh et al., 2022 ; Singh et al., 2023 ; Wan et al., 2024 )

(Kim et al., 2023b , a ; Ding et al., 2023 ; Jahanbakhsh et al., 2022 )

(Wambsganss et al., 2020 ; Shin et al., 2022 ; Wang et al., 2022 ; Zhang et al., 2023b ; Lin et al., 2024 ; Kim et al., 2024b ; Jakesch et al., 2023 ; Poddar et al., 2023 )

(Goodman et al., 2022 ; Di Fede et al., 2022 ; Suh et al., 2024 ; Reza et al., 2024 ; Lin et al., 2024 )

Goal-setting |

(Wambsganss et al., 2021 ; Resch and Yankova, 2019 ; Taiye et al., 2024 ; Benharrak et al., 2024 ; Choe et al., 2024 )

(Kreminski et al., 2020 ; Qin et al., 2024 ; Yanardag et al., 2021 ; Biermann et al., 2022 ; Gero et al., 2023 ; Tholander and Jonsson, 2023 )

(Maiden et al., 2019 )

(Zhang et al., 2023b ; Cai et al., 2024 ; Janaka et al., 2024 ; Benharrak et al., 2024 )

Translating |

(Singh et al., 2024b ; Sun et al., 2024 ; Choi et al., 2024 ; Choe et al., 2024 ; Buruk, 2023 ; Goel et al., 2023 ; Li and Wang, 2024 ; Park and Ahn, 2024 ; Shibani et al., 2024 ; Diloy et al., 2024 )

(Osone et al., 2021 ; Peng et al., 2023 ; Chung et al., 2022 ; Ghajargar et al., 2022 ; Dang et al., 2023 ; Yanardag et al., 2021 ; Biermann et al., 2022 ; Inie et al., 2023 ; Gero et al., 2023 ; Singh et al., 2023 ; Booten and Gero, 2021 ; Li et al., 2024 ; Kim et al., 2024a ; Hupont et al., 2024 )

(Kim et al., 2023b ; Gero et al., 2022 ; Fu et al., 2023 ; Bhat et al., 2023 ; Han et al., 2024 ; Liu et al., 2022 )

(Zhang et al., 2023b ; Lin et al., 2024 ; Cai et al., 2024 ; Janaka et al., 2024 ; Kim et al., 2024b ; Jakesch et al., 2023 ; Liu et al., 2022 ; Draxler et al., 2024b ; Li et al., 2024 )

(Bhat et al., 2023 ; Suh et al., 2024 ; Lin et al., 2024 )

Reviewing |

Evaluating |

(Wambsganss et al., 2022 ; Shen et al., 2023 ; Schmidt, 2020 ; Wambsganss et al., 2021 ; Ito et al., 2023 ; Pereira and Barcina, 2019 ; Taiye et al., 2024 ; Benharrak et al., 2024 ; Singh et al., 2024b ; Choe et al., 2024 ; Allen et al., 2018 ; Li and Wang, 2024 ; Shibani et al., 2024 ; Singh et al., 2024a ; Rawat et al., 2024 ; Wang et al., 2024 )

(Peng et al., 2023 ; Wang et al., 2022 ; Hoque et al., 2024 ; Xu et al., 2024 ; Yanardag et al., 2021 ; Gero et al., 2023 ; Liapis et al., 2023 ; Booten and Gero, 2021 ; Wu et al., 2024 ; Cheng et al., 2024 )

(Nouri et al., 2023 ; Robertson et al., 2021 ; Neyem et al., 2024 )

(Wambsganss et al., 2022 , 2020 ; Peng et al., 2020 ; Wang et al., 2022 ; Kim et al., 2022 ; Benharrak et al., 2024 ; Robertson et al., 2021 ; Cheng et al., 2024 )

(Cila, 2022 )

Revising |

(Wambsganss et al., 2022 ; Shen et al., 2023 ; Ito et al., 2023 ; Pereira and Barcina, 2019 ; Han et al., 2023 ; Benharrak et al., 2024 ; Choe et al., 2024 ; Huang et al., 2020 ; Buruk, 2023 ; Chang et al., 2021 ; Darvishi et al., 2022 )

(Yuan et al., 2022 ; Hoque et al., 2024 ; Booten and Gero, 2021 )

(Wambsganss et al., 2022 ; Wu et al., 2019 ; Peng et al., 2020 ; Zhang et al., 2023b ; Lin et al., 2024 ; Benharrak et al., 2024 )

(Ghai and Mueller, 2021 ; Goodman et al., 2022 ; Di Fede et al., 2022 ; Reza et al., 2024 ; Lin et al., 2024 )

Monitoring |

(Wambsganss et al., 2021 ; Resch and Yankova, 2019 )

(Liapis et al., 2023 )

(Arakawa et al., 2023 ; Sarrafzadeh et al., 2021 )

(Arakawa et al., 2023 )

(Cila, 2022 ; Muller and Weisz, 2022 )

Table 1 . Mapping of cited papers to writing processes and writing contexts, based on our systematic review of AI-assisted writing literature. The table reveals uneven research attention across cognitive processes and contexts–for example, strong representation of Generating and Translating activities in Creative and Academic settings, and limited focus on Monitoring across all contexts.

####

3.2.1. Writing Context Characteristics

In the following section we characterize our dataset by the writing context where they offered support, based on contexts adapted from Lee et al. (Lee et al., 2024 ) . We describe each writing context and how AI-assisted writing research supports each cognitive writing process across them; we also report how many papers 1 1 1 Note that the counts of papers do not add up to 109, the number of papers in our dataset. Although most papers only had a single context, a small number spanned multiple contexts. were coded into each writing context, as shown in Table 1 .

(1)

Academic (31 Papers).

The Academic writing context includes papers that are focused on research, analysis, or educational use. Papers in this context include topics such as assistance with literature review (Choe et al., 2024 ; Wang et al., 2024 ) , peer review (Neshaei et al., 2024 ; Sun et al., 2024 ) , academic writing (Taiye et al., 2024 ; Singh et al., 2024b ; Buruk, 2023 ; Shibani et al., 2024 ) , and essay writing (Dang et al., 2022 ; Wambsganss et al., 2021 ; Afrin et al., 2021 ; Resch and Yankova, 2019 ; Benharrak et al., 2024 ) . AI-assisted writing systems in this context are often focused on structured skill development for the users. Support for planning processes are typically intended to help users connect and structure their own ideas to accomplish complex tasks (Resch and Yankova, 2019 ; Taiye et al., 2024 ) . Translating support provides preliminary drafts or helps the user to restructure their ideas in a different form (e.g. point form to prose), but encourages the user to write and integrate ideas on their own (Sun et al., 2024 ; Singh et al., 2024b ; Choi et al., 2024 ) . Reviewing support is delivered in qualitative form, such as suggestions or summaries (Shen et al., 2023 ; Benharrak et al., 2024 ; Singh et al., 2024b ) . Systems do not revise the user’s text directly, instead recommending improvements to prompt the user to revise the work themselves.

(2)

Creative (37 Papers) . Creative writing papers focus on artistic expressions and narrative-based texts. In the Creative writing context, topics include: story writing (Osone et al., 2021 ; Lee et al., 2022 ; Clark et al., 2018 ; Chung et al., 2022 ; Yuan et al., 2022 ; Ghajargar et al., 2022 ; Kim et al., 2023a ; Biermann et al., 2022 ; Singh et al., 2023 ) , collaborative storytelling with AI (Kreminski et al., 2020 ; Nichols et al., 2020 ; Yanardag et al., 2021 ) , including CSCW work on AI support for human collaborative storytelling (Shakeri et al., 2021 ) and using dialects in creative writing (Wasi et al., 2024 ) . Other assistance includes character creation (Schmitt and Buschek, 2021 ; Qin et al., 2024 ) , poetry (Booten and Gero, 2021 ) , lyric generation (Ram et al., 2021 ) , writing screenplays (Mirowski et al., 2023 ) , and design fiction (Tholander and Jonsson, 2023 ) . AI also provides support with rhetorical or stylistic elements such as forming metaphors (Gero and Chilton, 2019 ) or learning vocabulary (Peng et al., 2023 ) . A focus of researchers in this area is conducting empirical studies with writers to discover their writing strategies and requirements for support (Biermann et al., 2022 ; Inie et al., 2023 ; Gero et al., 2023 ; Li et al., 2024 ; Wan et al., 2024 ; Kim et al., 2024a ) . Support for planning takes the form of generative ideation, usually presented as suggestions (Wang et al., 2022 ; Lee et al., 2022 ) , although some systems have a more equal and collaborative storytelling focus that weaves the AI ideas into the story text (Osone et al., 2021 ; Kreminski et al., 2020 ) . Support for translating often occurs simultaneously with support for generating ideas, creating narratives or creative elements that blend the user’s prior text with new ideas from the AI (Ghajargar et al., 2022 ; Chung et al., 2022 ) . Support for reviewing features a mix of quantitative and qualitative feedback, with a focus on the AI evaluating text and providing suggestions rather than revising it directly (Taiye et al., 2024 ; Choe et al., 2024 ) .

(3)

Formal (16 Papers) .The Formal writing context represents professional, standardized modes of writing, characterized by structured forms, limited use of personal or emotional expression, and purpose-driven tasks that entail specific communicative goals. AI support from papers in this context is focused on topics like enhancing productivity (Arakawa et al., 2023 ; Maiden et al., 2019 ) , writing business emails or reports (Fu et al., 2023 ; Liu et al., 2022 ; Neyem et al., 2024 ) , reviews (Bhat et al., 2023 ) , professional design problems (Ding et al., 2023 ) , copywriting (Kim et al., 2023a ) , document analysis (Jahanbakhsh et al., 2022 ) , clinical use (Han et al., 2024 ) and creating solutions to business problems (Guo et al., 2024 ) . Planning support in this context is focused on extending and organizing the user’s ideas, often through analogies and cross-domain reasoning (Kim et al., 2023b ; Gero et al., 2022 ) . Translating support is focused on writing efficiency, enabling the AI to write in the same interaction location as the user, or to make suggestions that are integrated directly in the text (Fu et al., 2023 ; Bhat et al., 2023 ) . Finally, reviewing support was limited, and focused on evaluation using quantitative feedback like readability metrics (Neyem et al., 2024 ) , and visual feedback such as progress bars (Nouri et al., 2023 ) .

(4)

Personal (24 Papers) . The Personal writing context concerns self-expression and sharing one’s thoughts, feelings, and experiences. Compared to other contexts, it embraces informality, subjectivity, and authenticity. Writing tasks in this context include non-academic opinion essay writing (Arakawa et al., 2023 ; Wambsganss et al., 2020 ; Lee et al., 2022 ; Zhang et al., 2023b ; Dhillon et al., 2024 ; Li et al., 2024 ) , blog or social media posts (Shin et al., 2022 ; Cremaschi et al., 2023 ; Lin et al., 2024 ; Cai et al., 2024 ; Janaka et al., 2024 ; Benharrak et al., 2024 ; Jakesch et al., 2023 ; Poddar et al., 2023 ) , personal messages (Kim et al., 2019 ) and journalling (Kim et al., 2024b ) . AI support in this context is generally targeted at lay users, emphasizing ease-of-use. Planning and translating support are intermingled due to the frequent use of longer AI outputs that directly ideate and write for the user, though these are generally presented as suggestions in order to preserve the user’s engagement with the text (Cai et al., 2024 ; Kim et al., 2024b ) . We also see transformation of user inputs between modalities like speech to text or visuals to text (Zhang et al., 2023b ; Lin et al., 2024 ) , or between textual forms like keywords to prose (Kim et al., 2024b ) . Reviewing support is typically provided through quantitative feedback, with a focus on evaluation rather than direct revision (Wambsganss et al., 2022 ; Peng et al., 2020 ) .

(5)

General (15 Papers) .

The General writing context contains systems that are presented for use in multiple contexts, or where the system design is not adapted to solving problems from a particular contextual domain. We also included systems that provide accessibility support in this context. Writing tasks include dyslexia support (Goodman et al., 2022 ) , support for people with speech impediments (Ghai and Mueller, 2021 ) , writing both personal and professional emails (Chen et al., 2019 ; Lehmann et al., 2022 ; Buschek et al., 2021 ) , and writing applications which are targeted at multiple contexts (Di Fede et al., 2022 ; Bhat et al., 2023 ; Reza et al., 2024 ; Lin et al., 2024 ; Suh et al., 2024 ) . A recurrent theme in planning and translating support in this context was the provision of interfaces that enabled rapid iteration and organization of idea and text generations (Lin et al., 2024 ; Reza et al., 2024 ; Suh et al., 2024 ) . Systems commonly provided suggestions for revisions which could be integrated directly into the writing area (Chen et al., 2019 ; Lehmann et al., 2022 ; Buschek et al., 2021 ) , aiding efficiency and idea exploration in the text.

####

3.2.2. Strategies for AI-Assisted Writing Support in HCI Research

Our analysis revealed four overarching design strategies for AI writing support that span cognitive processes and writing contexts. These strategies are distinguished by the AI’s role, intended user behaviors, interaction outcomes, interface design, and usage of AI outputs. Systems can combine elements from multiple strategies based on their supported writing processes and contextual requirements. Each strategy offers varying support for writers’ sense of agency, ownership, and task delegation preferences across different contexts.

(1)

S1: Structured Guidance . This strategy represents a scaffolding approach where AI systems function as writing coaches or tutors, guiding users through document development while maintaining their autonomy and preserving agency. This strategy emphasizes active skill development through structured practice rather than passive reception of AI-generated content, typically requiring predefined writing tasks. The strategy comprises four key components. Pattern Mapping focuses on developing connections and pattern recognition within existing content rather than generating new ideas, with AI systems helping users locate patterns in their data and analyze potential suggestions. Sequential Development denotes an iterative approach through drafts and milestones, where the system guides users in adapting suggestions to build their writing capacity. Scaffolded Feedback delivers assessments through structured templates, combining quantitative metrics with clear evaluation frameworks, and encouraging the user to perform their own revisions. Finally, Workspace Control employs user interfaces that physically separate AI and user workspaces, ensuring users maintain control over textual changes while explicitly initiating support requests at each stage of the writing process. Revisions utilizes proposals which the user can reference, or analysis to help the user revise their text, which ensures the user still contributes to the text. This approach respects writers’ need to maintain agency over ideation and organizing, thereby preserving their sense of ownership.

(2)

S2: Guided Exploration . This strategy positions AI systems as facilitators that enable users to actively explore and make connections within an idea space, with the AI functioning as both map-maker and guide. This strategy supports both well-defined and ill-defined writing tasks, emphasizing user engagement through iterative exploration and selection while maintaining creative control. It encompasses four main components. Idea Navigation implements a structured, self-directed approach that balances assistance with skill development, focusing particularly on interfaces which allow users to swap between generations to explore different approaches to their rhetorical problem. These systems enumerate the idea space using ideas generated by the AI. Output Variation denotes the provision of multiple types of output by the AI (i.e., narrative elements like plot and creative elements like dialogue), offering flexibility in AI generation. Systems directly replace user text in the writing area, enabling users to evaluate revisions in place, with the option of using the exploration interface to undo changes. Iterative Revision utilizes the map of the idea space generated in exploration to both structure potential ideas and guide revision, facilitating an iterative model of exploration and refinement by the user. Proposal Integration maintains user control by having the system present ideas and text generated by the AI as proposals. The focus on exploration offers the user flexibility in how to integrate generations into the artifact, with an emphasis on user-initiated AI output. This balances task delegation needs by allowing writers to maintain agency over idea selection while delegating generation, supporting their sense of ownership.

(3)

S3: Active Co-Writing . This strategy establishes AI systems as active writing partners, enabling a collaborative relationship where users selectively offload writing tasks while maintaining editorial control over the final output, though with potential implications for ownership. This strategy accommodates both well-defined and ill-defined tasks by supporting rapid iteration and efficient workflows. It consists of five primary components. Direct Generation involves direct generation of substantial content (i.e., full drafts or long text completions) intended for integration into the final artifact, encompassing both idea development and formal aspects of the text. Content Conversion preserves user ideas through various transformation types (i.e., foreign language translation, translating keywords to prose). The transformation retains the user’s original meaning, utilizing the AI to deliver that meaning in new forms. Efficiency Optimization denotes prioritization of speed and usability through streamlined interactions, contrasting with skill-development approaches. These are often deployed in Professional contexts where productivity is paramount. Turn-based Creation denotes turn-based interactions through chat or collaborative storytelling, facilitating human and AI creative input with automatic integration of AI contributions into the final artifact. Finally, Result Ownership maintains user control through suggestion selection and user-initiated AI output. However, unlike Proposal Integration, suggestions are integrated directly in the final text which may challenge writers’ sense of agency by blurring task delegation boundaries.

(4)

S4: Critical Feedback . This strategy positions AI systems as editors and organizers, facilitating a user’s reflective practice through structured feedback while maintaining a deliberate separation between the creation and analysis phases, supporting clear task delegation boundaries. This strategy requires well-defined tasks to enable evaluation and comprises four components. Unlike strategies that span the entire writing process, Critical Feedback represents a specialized approach where systems focus on reviewing and evaluation, maximizing analytical depth through structured assessments. Qualitative Feedback implements anthropomorphized or less-structured interactions that simulate tutoring scenarios through chat or natural language feedback. This method can provide revisions, but typically requires manual integration of suggestions by users. Quantitative Analysis provides structured assessments with a stronger focus on evaluation than revision, utilizing numerical or visual feedback. Hybrid Evaluation combines qualitative and quantitative approaches, using formal templates rather than conversational formats. This method offers a balance of revision and evaluation support that protects users’ agency by requiring effort to integrate into the text. Revision Guidance connects analysis and organization by offering revision suggestions based on idea summaries and providing fine-grained tools for specific revision tasks (i.e., merging, rewriting, summarizing). Analysis Separation maintains user control through deliberate separation between AI output and user workspace, requiring user-initiation of AI output, and introducing friction by requiring manual integration of AI-proposed revisions. This design choice deliberately preserves the writer’s agency over implementation decisions, reinforcing their ownership of the final text through strategic task delegation.

Table 2 . Distribution of systems by strategy across writing processes and contexts to show the prevalence of each design strategy in the literature dataset. Cell colouring is proportional to the prevalence of strategies deployed for systems in that cell, subject to a minimum height for readability. Systems could be coded to more than one process or context.

We applied our strategy framework to code the papers presenting system contributions (n=62) from our dataset to characterize the landscape of existing research systems. A single researcher assessed each system against the defining characteristics of each strategy. This coding revealed that S3 (Active Co-Writing) was the most commonly deployed approach (23 systems, 37.1%), followed by S1 (Structured Guidance) (19 systems, 30.6%), S2 (Guided Exploration) (11 systems, 17.7%), and S4 (Critical Feedback) (9 systems, 14.5%), with the full distribution shown in Table 2 . Clear patterns emerged across writing processes, with S1 dominating Evaluating (54.5%) and S3 leading in Generating (52.9%) and Translating (50%) processes. Context-specific preferences were also evident, with Academic writing favoring S1 (61.1%), Creative writing employing S3 (50%), and Formal writing preferring S2 (42.9%). Creative writing showed surprisingly high deployment of S3 systems, which are the most likely to threaten ownership. While the single-coder approach represents a limitation, this application of our framework highlights opportunities for more nuanced strategy implementation across cognitive processes.

##

4. Study 2: Investigating AI’s Influence on Ownership in Writing

To answer RQ2 : “Which cognitive processes do writers consider essential to control in order to maintain their sense of agency during AI-assisted writing, and how do user situations, writing contexts, and AI interaction types shape their perceptions of ownership?”, we conducted interviews with 15 writers.

###

4.1. Methods

We detail the methodological details of our second study, including participant recruitment, study procedures, and our approach to data analysis.

####

4.1.1. Participants

We recruited 15 writers (8 women, 6 men, 1 did not specify; other gender options were offered) across two age groups: 5 participants aged 18–24 and 10 aged 25–34. Participants were based in North American and European cities and were recruited via social media and email invitations. They possessed diverse writing experience, including academic research papers (W11, W14), knowledge translation (W4), short stories (W2), poetry (W9), novels (W7, W13), essays (W1, W10), blogs (W4), screenplays for TV shows (W12), newspaper articles (W15), personal diaries (W5), internal project documentation (W6) and creative fiction (W3, W8). 11 participants reported having professional writing experience (i.e., when writing is paid or a core part of their occupation). Weekly time spent on writing varied, with 5 participants writing 1–4 hours, 5 writing 4–7 hours, 3 writing 7–10 hours, and 2 spending more than 15 hours per week.

Given our focus on AI-assisted writing, prior experience with AI writing tools was an inclusion criterion. All participants reported using ChatGPT, with Grammarly and Microsoft Copilot being the next most popular tools. Some advanced users also experimented with other LLMs and specialized AI writing tools, including Claude, LLaMA , and writing tools like Sudowrite. To ensure our findings were not biased toward users with a particular level of knowledge of generative AI, we recruited writers with varying generative AI expertise, ranging from slightly to extremely knowledgeable. The attached supplementary materials contain detailed information on writer profiles.

####

4.1.2. Procedure

Each study session lasted between 60 and 90 minutes and was conducted online via recorded video calls by the lead author, allowing us to reach participants across multiple geographic locations. We introduced participants to the study and then asked them to complete a 5-minute pre-survey to provide consent and share demographic information, their writing experience, and AI usage. We informed participants of their right to withdraw from the study at any time and compensated each participant with 20 CAD for their time. The institution’s research ethics board approved the study protocol.

Following the pre-survey, we conducted a semi-structured interview in which participants described their writing background and experience with AI, and shared their perspectives on how AI influences their sense of ownership across each aspects of the writing process. We defined each process, to ensure writers could relate their practices to the processes. Finally, participants completed a 10 minute post-interview survey, reflecting on the discussion and rating 16 Likert-scale statements (4 for each process). This survey helped us gauge preferences for AI involvement in each element of the writing process. Further details on the post-interview survey Likert items are provided in Figure 3 ). The pre-interview survey and study protocol can be found under supplementary materials.

####

4.1.3. Data Analysis

The data included transcripts of the interview recordings and responses to pre- and post-interview surveys. To identify factors that influence writers’ sense of ownership in the AI-assisted writing process, we conducted a reflexive thematic analysis (Braun et al., 2023 ) of transcripts through an inductive-deductive approach. Guided by the cognitive process theory of writing, we used the main writing processes—planning, translation, reviewing, and monitoring—as predefined codes to structure our interpretation, while also inductively identifying new patterns. The pre-survey data provided important context about each participant’s background in writing and prior experience with AI tools. The post-interview survey helped quantify attitudes toward AI across different cognitive processes. Scores for negatively worded items (Q1, Q3, Q5, Q9, and Q13) were reversed (see Figure 4 ). Given the varied perspectives on ownership across writing elements, our goal was not to aggregate results into a single measure of ownership and agency but rather to examine distinct aspects of the writing process.

Figure 3 . Likert-Scale Statements on User Perceptions of Cognitive Processes during Writing

\Description

Likert-Scale Statements on User Perceptions of Cognitive Processes

###

4.2. Study 2 Findings

The post-interview survey responses are summarized in Figure 4 . A detailed csv file of the responses can be found in the supplementary materials. Items are grouped into sets of four, labeled P 1-4, T 1-4, R 1-4, and M 1-4, corresponding to the four cognitive processes in the Flower and Hayes writing model: P lanning, T ranslation, R eviewing, and M onitoring. The item questions are detailed in Figure 3 . The distribution of ratings reflects a range of perspectives on the extent to which writers want AI to intervene across different processes. We interpret this diversity through our thematic analysis, and share findings on how writers perceive and maintain a sense of ownership and agency over the writing process when working with AI. We group these insights under three primary themes, each highlighting a different dimension of the writers’ relationship to AI and their work:

(1)

When Ownership Matters : This theme delineates the contextual factors–such as time constraints, level of trust in AI, task importance, and perceived competence–that shape writers’ decisions around how much control they want to retain and how much they are willing to delegate to an AI tool, even if it means their sense of ownership is encroached. Instead of assuming the desirability of ownership as an inherent or static prerequisite, this theme showcases the flexible role that human agency plays in AI-assisted writing and how it responds to situational factors. It also highlights situations where the risk of writers’ overreliance on AI is particularly prevalent.

(2)

What Writers Want to Own : This theme characterizes the aspects of the composition process and product from which writers derive their sense of ownership and prioritize as their primary contribution. We identify a central distinction between content and form: writers prioritize idea generation and planning as their primary contribution in content-oriented writing, where the purpose is primarily expository, while in form-oriented writing, where the focus is on style and voice, they emphasize the need to exercise more control during translation and revision to convey their unique expression.

(3)

How AI Interactions Shape Ownership : This theme explores how interaction design impacts writers’ senses of agency and ownership. We look at how different interface elements shape how writers feel when AI intervenes, such as the option to receive suggestions rather than direct edits, providing multiple suggestions, exercising final say, and UI affordances for enabling and disabling AI input. This theme highlights the critical role that Human-AI interaction design can play in maintaining writers’ sense of agency and ownership in AI-assisted workflows.

Figure 4 . User perception likert-Scale items on writers’ sense of ownership across cognitive processes (Flower and Hayes, 1981 ) . The distribution shows notable variation in the desirability of AI support across processes.

\Description

Figure illustrating the likert responses to survey.

Together, these three overarching themes offer a way to grapple with the complex interplay between writer agency, task demands, and AI functionality, helping AI system designers make sense of how ownership is negotiated and maintained in AI-assisted writing.

####

4.2.1. When Ownership Matters

We found four factors that influence how much control writers are willing to give to the AI and the extent to which they care about maintaining their sense of ownership in the first place – time constraints, task importance , confidence in the writers’ own abilities, and trust in the AI’s capabilities.

(1)

Time: A key reason writers are drawn to generative AI tools is efficiency. Therefore, in time-sensitive situations, writers are more willing to delegate tasks to the AI. W4 described ChatGPT as “a huge time saver” , noting how “it sometimes helps when you’re working on something super last minute, to have an AI look at it as well, and go through it in greater detail and precision” than them. In addition to proofreading, writers are also more willing to delegate other aspects of the writing process. W11 shared how they used AI tools to transform rough bullets into polished writing. “There are also situations where I’m running short of time, and I will have a list of things I want to add…ordered in a reasonable way as I want them to appear in the writing. Then I will just ask ChatGPT to draft something based on the list.” A similar point was echoed by W7, who described how they convert messy outlines into coherent text: “to save time, I will write out all bullet points myself that are really messy, and then have ChatGPT turn it into a letter.”

(2)

Importance: Writers de-prioritize ownership in low-stakes tasks, such as routine emails or straightforward professional communication, where clarity and efficiency are the primary goals. Such tasks tend to be perceived by writers as more functional than creative, making AI tools more acceptable for generating content without affecting their sense of ownership. The inverse is also true–when the stakes are high, writers become much less open to the idea of AI involvement, as captured by W2’s comment: “It depends how important this project is, because if it’s very, very important to me, I would give [AI] less responsibility, almost to the point where it’s just used as like something that I accept or reject, just like an editor who works for you, you can either accept or reject it or revise it… if it was not that important, like an email that I’m just kind of sending off. I would give it almost all the work, honestly.” W15’s remark reveals how this choice to adjust the importance of ownership is deliberate, and not necessarily due to a lack of self-awareness – “I use [AI] to finish my emails when Gmail tells me to finish with yours sincerely…I’m like, sure that’s what I say. So for me, that’s the sort of use of LLMs that I find quite pervasive in the background, and which I am definitely happy to use…I suppose there’s an irony in pressing Tab to write ‘Yours sincerely’. You see, right? You’re not being sincere.”

(3)

Confidence: For writers who feel less confident in specific language skills, AI tools can serve as a resource for checking for linguistic accuracy. Relying on AI for such help does not necessarily impact the writers’ sense of ownership, as W3 observes: “for grammar and spelling, those are inconsequential, right? I don’t associate that with the voice… It’s a menial task that can be taken care of by AI that doesn’t impact someone’s voice.” This selective reliance on AI allows writers to focus their energy and sense of ownership on other parts of the work, while using AI to polish weaker areas. W3 elaborates on this intentional boundary: “I would want to make sure that anything that revolves around characters talking with one another, or whenever I write about the thoughts that the character is experiencing in their head, I’d want those to be my own work. But when it comes to describing a scene or a setting… that’s something that as a writer, I’m not that great at, and so it’s seeking help to make sure that my own work gets very polished.”

(4)

Trust: Just as confidence in their own abilities influenced writers’ sense of ownership, their delegation choices were also shaped by their trust 2 2 2 The concept of trust and agency are interrelated, as they both influence users’ decision-making abilities (Knittel et al., 2019 ) . —or lack thereof—in the AI’s ability to deliver reliable output. This was particularly evident among writers who were confident in their own abilities but skeptical of AI. For example, W10 explained, “I don’t particularly like the writing style. I don’t trust it enough. There will always be a few nitpicks in any paragraph that I’ll have with it. So in that way, I feel like I’ve been able to retain a total sense of ownership. I don’t feel like it’s influenced it any more than if I had someone read it and they said I liked it, or I didn’t like it, or this part sucks.” The ability to critically evaluate AI output helped writers like W10 maintain a sense of separation between looking at AI output and feeling like it inadvertently influenced them. W8 held reservations about the AI’s ability to gauge how humans would respond to a piece of writing – “I just don’t trust AI to judge whether something is understandable to a person or not, especially because of the variety of audiences I write for.” Instead, they turned to humans for feedback, relying on colleagues and friends with different levels of expertise, from both within and outside their fields, to get varied perspectives on their work.

Table 3 . Delegation Strategies Based on Content and Form Contributions with Expanded Planning Categories

Cognitive Processes |

Content (e.g., Academic)

Form (e.g., Creative)

Planning |

Generating |

Strong ownership over novel ideas with minimal AI input. W9: “The core part of writing is ideas… even if ChatGPT helps organize, the ideas remain mine.”

AI-assisted ideation via prompts, but creativity retained by writer. W3: “I’d use [AI] for prompt creation… as a starter, then dive into writing.”

Organizing |

AI supports in structuring ideas, retaining ownership over logic flow. W9: “I let ChatGPT organize the ideas… but the logical flow is my own.”

AI-assisted outline creation for enhanced cohesion, writer’s tone. W3: “Organizing can be AI-assisted if it doesn’t alter my style.”

Goal-setting |

Writer defines key objectives and frameworks; AI used for background structure alignment. W13: “If I outline the goals clearly, ChatGPT can help format, but the primary direction remains mine.”

Creative goals set by writer; AI supports structure adjustments. W7: “My voice is in the goals of the story, AI only aids in structure refinement without altering intent.”

Translating

AI used for drafting structured text; ownership tied to novel ideas, not genre standards. W7: “Academic writing feels less mine… I’m fine with delegating structure [to AI].”

AI assistance should be limited; primary voice retained through sentence-level decisions. W7: “Where I feel the most ownership is over sentences themselves.”

Reviewing |

Evaluating |

Grammar and clarity editing delegated to AI for efficiency. W3: “For grammar, those are inconsequential… AI can handle it.”

Limited AI assistance; primary voice retained through sentence-level decisions. W7: “Where I feel the most ownership is over sentences themselves.”

Revising |

AI-intervention to refine writing clarity is welcome. W14: “I have a tendency to over-write, explaining things in a longer way; it can be much more concise. [AI can help] in that stage of the editing process.”

Strong sense of novelty in breaking conventions for stylistic effect and unique voice. W7: “I break grammatical conventions for aesthetic effect… it’s important for the voice, so I’m not interested in AI changing those choices.”

Legend:

Red - Little Support

Yellow - Moderate Support

Green - Significant Support

####

4.2.2. What Writers Want to Own

In analyzing the areas from where writers draw their sense of ownership, we found a clear and recurring pattern: writers value ownership most strongly over components of the composition process they see as their primary contribution. Writers tend to be more open to delegating composition tasks to an AI for areas that are tangential to their perceived primary contribution. When task delegation is done this way, writers’ sense of autonomy and joy in creating something novel is maintained—or even enhanced in cases where the AI frees up their focus.

We identified two main types of contributions—content and form—each linked to specific cognitive processes. Content contributions involve generating ideas and setting goals, aligning with the planning process in the Flower and Hayes model (Flower and Hayes, 1981 ) . Form contributions focus on style, tone, and flow, aligning with translation and revision. This content-form distinction connects writing contexts with cognitive processes: academic and non-fiction writers prioritized content to convey ideas clearly, while fiction writers emphasized form, valuing their unique voice and style. Below, we explore writers’ sense of ownership for these two types (see Table 3 for mapping):

(1)

Content: When the purpose of a piece of writing is to convey pre-existing ideas or information with clarity–as is common in academic and non-fiction writing, the content itself becomes the primary contribution and the central focus of ownership for writers. In these writing contexts, writers derive a sense of ownership by engaging in cognitive processes involved in ideation and organization of ideas, making planning the dominant process that they seek to control. When the ideas are established, writers are open to using AI tools for translating ideas into clear language or reviewing their work to enhance clarity and polish. This is reflected in W9’s perspective on non-fiction: “I think the ideas are the core part of the writing. So if I’m giving ChatGPT the ideas that I want it to kind of organize, I think I still maintain that ownership of like, oh, those are my ideas, but it’s enhancing my writing.”

The desire to emphasize ownership over content rather than form is influenced by external constraints, such as word counts or stylistic conventions. W7 captures this sentiment when discussing the formulaic nature of research papers: “I feel less ownership of my writing in general, just because the rhetorical context in which I’m writing is so rigid and has such clear expectations… I feel like I did something interesting as part of the research project, but the write-up itself is just a write-up and nothing more. [I’m] fine to delegate the vast majority of that process to someone else.” Since LLMs are trained on established standards, they can assist with refining text to meet these norms.

(2)

Form: In contrast, when writers have freedom over form, the idea of AI models intervening in the translation process becomes less appealing. W7, a professional literary fiction writer and novelist, explained how their sense of ownership lies in the “sentences themselves and how sentences are sculpted,” emphasizing that this sentence-level decision-making is “what sets me apart as a writer.” For them, style, rhythm, and structure are the personal touches they are not willing to delegate to AI or any other external influence. They further noted that while ideas and themes can feel culturally shared, the form in which those ideas are presented is where the writer’s individuality comes through: “Where I feel the most ownership as a literary author is over sentences themselves and how sentences are sculpted. So that’s where I’m least willing to secede to anyone else, including an AI, because I consider kind of like my, my sentence-level decisions in large part. But what sets me apart as a writer… Whereas my ideas I think of as less oftentimes I use ideas which strike me as things which are kind of out in the ether culturally already, or it’s not like each scene or particular decision I make conceptually is really distinct and different.”

Even if the language models were trained to mirror an author’s personal style, form-oriented writers could find this prospect wholly unappealing– “I would feel a little violated. I think for me, personal style is so signature to me, like to who I am, like, I don’t want AI to be like, training itself on me and then trying to emulate me. ” , remarked W12 also a professional writer. This sentiment underscores how, for writers whose sense of ownership is rooted in form and personal style, attempts to design systems that mimic their unique stylistic choices can clash with core values.

What about hobbyists? Turning to W3, a hobbyist fantasy fiction writer, who uses AI to handle parts of the ideation phase so they can “jump straight into writing.” They describe using AI to generate writing prompts and background settings, allowing them to focus on what they consider the core writing process: “I would occasionally use it for [writing] prompt creation. So just to kind of give [me] a little bit of a starter, just to have some kind of setting to work with so that I don’t need to spend a lot of time with the story building, the world building, at least the initial world building, and can just jump straight into writing.” Here, W3 also uses language that separates the ideation process from what they see as core “writing.” Their phrasing indicates a view of ideation as a necessary setup that can be delegated to AI, while the actual crafting of sentences is where they feel personal investment and ownership.

####

4.2.3. How AI Interactions Shape Ownership

The third and final theme explores how different types of Human-AI interactions impact writers’ sense of agency and ownership, as writers monitor and make decisions on the various cognitive processes during writing. Interface features such as the ability to choose between AI-generated suggestions, maintain final decision-making power, and toggling AI assistance on and off allow writers to retain autonomy over their work. We find a common theme across these interactions: writers feel a stronger sense of ownership when they perceive themselves as having substantial control over the AI’s contributions, and that interaction design can shape these perceptions. We will illustrate this via four feature concepts that preserve ownership: AI Suggestions , maintaining Final Say , Global AI Toggles and Local AI Toggles :

(1)

Suggestions

Participants consistently shared that receiving AI suggestions that they could accept, reject, or modify, was a non-negotiable aspect of preserving their sense of agency. This preference is underscored by the interaction mode where AI directly inserts or overwrites text within the users’ writing space, which writers felt encroaches on their sense of ownership. W7 explained that suggestions maintained their sense of ownership by framing AI as an optional aid rather than a co-author: “If it’s sort of making suggestions, then it would not change my sense of ownership over the text, because I’d still feel like that’s just sort of this pop-up window. But if it was inserting values in a more direct way, I think I would probably feel like I was losing some ownership.”

(2)

Final Say W3 highlighted the importance of having the final say over AI-generated content: “I know that at the end of the day, if I ask it for help, it’s not like, it’s not a final say per se, right? It’s not that I’m resigning my writing to the chatbot… if those suggestions turn out to be helpful, then I can continue with them, or I can set them aside as I see fit. So ultimately, I’m always in control.”

W15 further described this decision-making as a “negotiation” with the AI, framing ownership as an iterative process of consciously selecting and refining suggestions: “I find it has to be a negotiation. I think, like, you see what the thing is suggesting, you think about that, and then you decide to take it on board. And I feel like that moment of decision and conscious interpolation of what it’s suggesting… that’s where the sense of ownership is not taken from you.”

These examples indicate how writers preserve ownership by positioning the AI as an helper rather than a primary co-author. For primary contributions writers used the AI as source for inspiration, not substance. In less critical tasks, writers were open to using AI content selectively, to enhance efficiency without compromising ownership. But regardless of the stakes, they always wanted to have the final say.

(3)

Global AI Toggle to Maintain Flow State: Writers wanted the option to toggle AI suggestions on and off to minimize distractions. This is apparent in W7’s description of their frame of mind during fiction-writing: “In fiction writing, I really get in the zone, which is important to me so much that I like to block out even just sort of my background, my desktop, just everything… if it’s at a moment where I’m editing anyway and sort of moving things around, yeah, I mean, especially if I had sort of like an intuition already… I would be happy to hear any and all suggestions from anyone, including an AI.”

The ability to enter a “zone” or flow state reinforces writers’ ownership, as they feel more connected to the work without interference. Similarly, W1 emphasized the need for flexibility to open and close AI assistance as needed: “If there’s like a feature where I can open for a suggestion, like a little separate tab on the right side of my screen, and I can always open and close it… when I’m like, really focused… I don’t have to care about what AI keeps suggesting, so as long as the user has that flexibility, it’s okay to keep focused.”

(4)

Local AI Toggle for Intentional Rule-Breaking: Sometimes, instead of completely turning AI off, more advanced writers like W7 wanted fine-grained control over specific AI capabilities, to avoid the system impeding on deliberate diversions from writing norms: “Oftentimes in literary writing, we break grammatical conventions all the time… comma splices have become much more common in fiction writing, just because people use comma splices in real life all the time. ” For W7, intentional rule-breaking was a distinctive aspect of their voice. Having the option to override AI suggestions that would “correct” these stylistic choices allowed them to preserve autonomy and authenticity in their work.

These examples show how form-oriented writers prioritize their own stylistic and creative sensibilities, even in scenarios with established standards or grammar. They also point to the role that AI interaction design plays in supporting writers with monitoring and decision-making. W8 expands on this idea: I think for me, writing is so much about decision making that’s like what you’re doing at every single stage. And so I think that that’s part of why I feel so attached to the AI being the one that’s suggesting, but not necessarily the one that’s directly editing anything that you’re working on, …so it’s important that those decisions are primarily made by you and not by the AI.”

##

5. Alignment Between the Two Studies

By comparing our literature review findings with our interview study results, we identify where existing design strategies address writers’ concerns and where opportunities exist for more responsive system designs. This section analyzes alignment across three critical dimensions corresponding to the themes from section 4 : contextual factors affecting ownership concerns, writing process preferences across different contexts, and interaction design choices that shape writers’ sense of agency.

Cognitive Processes |

Level of AI Support Demanded |

Level of AI Support Offered by Strategy |

Content

Form

S1: Structured Guidance

S2: Guided Exploration

S3: Active Co-Writing

S4: Critical Feedback

Planning |

Generating |

Strong user ownership over novel ideas with minimal AI input.

AI-assisted ideation via prompts, but creativity retained by writer

Ideas come from the user; AI helps them form connections and identify patterns

AI generates ideas which enumerate different approaches; user explores the idea space

AI maintains the user’s ideas while extending them or transforming them (e.g. keywords to prose)

Limited support for idea generation

Organizing |

AI supports in structuring ideas, retaining user ownership over logic flow

AI-assisted outline creation for enhanced cohesion in writer’s tone

AI helps the user to learn to structure their ideas in a particular domain

User structures their ideas based on exploration through AI generations

AI assists with outline creation and structuring ideas

Revision guidance supports organization of ideas following evaluation

Goal-setting |

Writer defines key objectives and frameworks; AI used for background structure alignment

Creative goals set by writer; AI supports structure adjustments

Scaffolding of AI system provides pre-defined objectives that must be followed by the user

User defines goals, with AI assistance through iterative exploration and selection of ideas

AI works collaboratively towards writer-defined goals with some autonomy

User maintains control over the text’s goals; AI supports user goals through critical feedback

Translating |

AI used for drafting structured text; user ownership tied to novel ideas, not genre standards

AI assistance should be limited; primary voice retained through sentence-level decisions

AI content is integrated into the work through an iterative approach

AI provides both high-level (e.g. structural elements, plot) and low-level (e.g. dialogue) support

Users offload writing tasks to AI, emphasizing productivity and usability

Deliberate separation between AI and user workspaces, and manual integration of AI output limits translation support

Reviewing |

Evaluating |

Grammar and clarity editing delegated to AI for efficiency

Limited AI assistance; primary voice retained through sentence-level decisions

Scaffolded feedback enables AI to deliver comprehensive evaluations to users

User evaluates writing by comparing it to other AI generations

Limited support for user’s text evaluation; AI is focused on generating content

AI systems provide qualitative and/or quantitative feedback on a user’s text

Revising |

AI-intervention to refine writing clarity is welcome

Strong sense of novelty in breaking conventions for stylistic effect and unique voice

AI generates proposals to help the user refine their work as a skill-building tactic

AI provides text in the user’s workspace, enabling users to evaluate revised text in place

AI suggestions for revision are integrated directly into the text

AI offers fine-grained tools for specific revision tasks (e.g. summarizing)

Legend:

Red - Little Support ;

Yellow - Moderate Support ;

Green - Significant Support

Table 4 . Comparison of AI Delegation Strategies Demanded by Study Participants and Offered by Strategies from HCI Literature, based on the support demands from participants in Section 4.2.2 and AI support from each design strategy enumerated in Section 3.2.2 . Cells are coloured by the degree of AI support demanded or provided, respectively.

###

5.1. Alignment with Contextual Factors of Ownership

Writers’ concerns about ownership in AI-assisted writing are contingent on specific contextual factors. Our interview study identified four factors that influence writers’ concerns about ownership in AI-assisted writing: time constraints, level of trust, task importance, and perceived competence. These factors represent a user’s personal value-based context or external limitations that shape their willingness to delegate writing tasks to AI. Our analysis indicates strong alignment between existing research priorities and writers’ concerns. Researchers in HCI have worked extensively to investigate these dimensions, producing studies characterizing user values, social dynamics, and professional contexts (Gero et al., 2023 ; Biermann et al., 2022 ; Kim et al., 2024a ; Li et al., 2024 ; Rezwana and Maher, 2023 ; Inie et al., 2023 ) that influence ownership preferences and how they shape users’ attitudes toward AI assistance.

The CSCW community has addressed several of these factors. Shakeri et al. (Shakeri et al., 2021 ) designed an AI system to enable human-human collaborative writing by offloading narrative tasks to AI. By ceding ownership of narration to AI, while retaining control over their character’s dialogue, users were able to alleviate time constraints and vulnerability caused by a lack of perceived confidence in creative writing. Hauptman et al. (Hauptman et al., 2022 ) found that professionals’ desire to collaborate with AI was associated with the provision of explainable, actionable feedback and shared social context to build trust, reflecting the preferences of our interview participants. Beyond the text modality, Zhang et al. (Zhang et al., 2023a ) created a multi-level human-AI co-creation framework that enables users to customize the level of AI assistance based on their perceived needs and time, though with limited observations of the effects on users. Cao et al. (Cao et al., 2023 ) investigated the impact of time pressure on human decision-making abilities, and the potential for AI support systems to mitigate these effects. Finally, Tang et al. (Tang et al., 2024 ) found differential usage patterns of image-generating AI between professional and non-professional users driven by perceived competence and level of trust.

###

5.2. Alignment with Essential Cognitive Processes

Our interview study revealed a critical distinction in what writers want to own, dividing writing contexts into two broad categories: Form-centric and Content-centric. As shown in Table 4 no AI design strategy maps perfectly onto the delegation demanded by our participants. This highlights the importance of flexible systems that allow users to adjust AI involvement across different writing processes.

####

5.2.1. Form-centric Writers

The Creative, Personal, and General writing contexts afford writers greater freedom over form, allowing expressive personal styles. Form-centric contexts emphasize ownership over translation and revision while being more open to AI assistance with planning and ideation. As seen in Table 2 , these contexts had a mixed distribution of design strategies, with the plurality in each case being S3 (Active Co-writing). Since S3 prioritizes task efficiency and offloading work to the AI, this strategy may not fully address the needs of writers concerned primarily with Form contributions. For these writers all strategies offer more AI support in translating and reviewing than they demanded. We see awareness of this tension in systems that deploy S2 (Guided Exploration) methods of exploratory, iterative ideation which prompts creative writers to expand on ideas themselves. Research in this area, exemplified by (Schmitt and Buschek, 2021 ; Gero and Chilton, 2019 ; Kim et al., 2023b ; Di Fede et al., 2022 ) , merits continued investigation to better support form-focused writers’ sense of ownership.

####

5.2.2. Content-centric Writers

Content-centric writing contexts such as Academic and Formal writing prioritize communicating ideas with clarity and are subject to external stylistic constraints. Our interview participants in these contexts were primarily concerned with generating and organizing ideas and setting goals. For these writers, S1 (Structured Guidance) and S2 (Guided Exploration) are well aligned in terms of their Translation, Evaluation, and Revision AI support. As shown in Table 2 , S1 and S2 systems represented 61% of systems in Academic contexts and 57% in Formal contexts, demonstrating alignment between existing designs and the support demanded by our participants. Our analysis suggests these strategies offer more AI planning support than Content-focused writers desired. This indicates an area where users might benefit from proffering granular control over AI involvement.

###

5.3. Alignment with Desired Interfaces and Interactions

####

5.3.1. Suggestions

Presenting AI content as suggestions is a common interaction design approach in AI writing systems, aligning well with users’ demands. Researchers have investigated visual differentiation of suggestions (Osone et al., 2021 ; Singh et al., 2023 ; Bhat et al., 2023 ) , enabling users to clearly distinguish between their own writing and AI-generated content. Other studies have examined the impact of suggestion length or quantity of suggestions on user experience and acceptance (Fu et al., 2023 ; Buschek et al., 2021 ; Dhillon et al., 2024 ) , finding that suggestion length is inversely associated with perceived ownership of the text. The placement of suggestions within the interface also emerged as an important design consideration. Some systems present suggestions directly in the user’s workspace (Chen et al., 2019 ; Buschek et al., 2021 ; Bhat et al., 2023 ) , creating a more integrated experience but potentially blurring boundaries between user and AI contributions. More commonly, systems display suggestions in a separated interface (Goodman et al., 2022 ; Lehmann et al., 2022 ; Nichols et al., 2020 ; Dhillon et al., 2024 ) . This separation creates a deliberate boundary that reinforces the writer’s role as decision-maker, aligning with our interview participants’ desire to maintain control over what enters their final text.

####

5.3.2. Final Say

Across the four design strategies we identified, each approach agency differently while supporting the principle of the writer having the Final Say. Workspace Control (S1) physically separates AI and user workspaces, ensuring changes require explicit user action. Proposal Integration (S2) presents AI-generated content as suggestions within an exploration framework. Result Ownership (S3) streamlines AI integration but potentially creates tension around authorship of the final product. Analysis Separation (S4) creates deliberate friction by requiring manual integration of AI-proposed revisions. Despite their differences, all approaches recognize that writers want to maintain editorial control. Across our dataset we did not encounter any systems that removed the writer’s editorial control. However, some empirical studies (Draxler et al., 2024b ) did have experimental conditions where the user had no influence over AI-generated text-which was associated with a reduction in perceived ownership.

####

5.3.3. Global and Local AI Toggles

We found that Global and Local AI Toggles are notably underrepresented in AI interaction research. While researchers such as (Draxler et al., 2024b ; Singh et al., 2023 ; Dhillon et al., 2024 ) include control conditions with no AI assistance, our dataset contained no systems that offered participants the option of an AI toggle during normal operation. It was common that systems had user-initiated AI interactions, however this design choice does not fulfill our participants’ desire for minimizing distractions or fine-grained control over how the AI interacts with their stylistic choices. This gap is noteworthy given that theoretical research on human-AI collaboration frameworks, such as (Muller and Weisz, 2022 ; Moruzzi and Margarido, 2024 ; Shneiderman, 2022 ) including CSCW research (Zhang et al., 2023a ) , do investigate interfaces that modulate AI support as a mechanism for humans to exert control over AI initiative in complex tasks. The absence of these features in empirical design research presents an opportunity to investigate how toggles impact users’ agency and ownership in practice. We encourage more research into systems where users can actively control their collaboration with AI and restrict assistance to designated components or remove it altogether.

###

5.4. Monitoring

Our analysis identified Monitoring as significantly underexplored in AI writing research. This high-level cognitive process becomes more complex with AI, as users must both monitor their own writing and oversee AI contributions. While monitoring as a cognitive process is distinct from the collaborative relationship between human and AI, they are connected through process management and a meta-level view of both the individual and collaborative writing processes. The gap likely stems from research focusing on optimizing specific interactions rather than examining broader collaborative dynamics. For instance, studies on suggestions do not allow participants to disable AI assistance entirely.

This represents a key research opportunity for CSCW. As AI systems advance, monitoring and management of the human-AI collaborative relationship becomes increasingly important. The lack of research on monitoring and AI toggles suggests that current systems may not fully address writers’ dynamic control over their collaboration. By developing more flexible interfaces that allow writers to modulate AI involvement, researchers could better support the nuanced relationship between assistance and ownership that emerged from our interview study.

##

6. Discussion

This paper, to our knowledge, is the first comprehensive study on designing for human agency within AI-assisted writing that combines a systematic review of generative AI-era research with an analysis of writers’ perspectives on preserving agency and ownership. By considering both the state of the literature and user perspectives on ownership, we offer timely, actionable guidance to designers shaping the future of AI writing tools.

###

6.1. Key Findings

####

6.1.1. RQ 1: What design strategies are used or suggested in existing AI-assisted writing research and how are these strategies distributed across writing processes and contexts?

We answered the first research questions through our systematic review and thematic analysis ( section 3 ), where we identified four primary strategies for AI-assisted writing support: Structured Guidance (S1), Guided Exploration (S2), Active Co-Writing (S3), and Critical Feedback (S4). S1 provides structured guidance while building user skills (e.g., LitWeaver by Choe et al. (Choe et al., 2024 ) leads novice researchers through completing a literature review), S2 enables creative control through systematic exploration (e.g., ABScribe by Reza et al. (Reza et al., 2024 ) enables users to rapidly iterate on chunks of text, storing previously-explored ideas and recipes for future exploration and revision), S3 supports efficient collaboration while maintaining user control (e.g. DiaryMate by Kim et al. (Kim et al., 2024b ) encourages users to select between AI suggestions to compose a diary that was meaningful to them), and S4 promotes strategies that facilitate user reflection and engagement through analysis and feedback (e.g. Impressona by Benharrak et al. (Benharrak et al., 2024 ) specifies Personas that provide targeted feedback, prompting user reflection with a particular audience in mind). These strategies are valuable because they distill Generative AI research into actionable insights from the literature.

####

6.1.2. RQ2: Which cognitive processes do writers consider essential to control in order to maintain their sense of agency during AI-assisted writing, and how do user situations, writing contexts, and AI interaction types shape their perceptions of ownership?

While the strategies represent current research, they do not offer guidance on writers’ values tied to preserving human agency. Our second study helps bridge this gap. We found three themes that explain when ownership matters (in relation to four contextual factors: time, importance, confidence, and trust, covered in Section 4.2.1 ), what writers want to own (in relation to two primary contribution types: content and form, covered in Section Section 4.2.2 ), across the cognitive processes: planning, reviewing, and translating (Flower and Hayes, 1981 ) .)

Each study offers useful insights on their own, but combining them is far more useful to designers because together, it not only maps the current research landscape, but also enables us to offer designers guidance on what should be done to align with user demands, as explored in detail in section 5 . Study 1 is akin to a map handed to a sailor (the designer). Study 2 is akin to a compass that tells them where to go. Our findings indicate how writers’ sense of ownership is tied to specific cognitive processes: content-focused writers derive ownership primarily from ideation during the planning phase, as they feel that is where their primary contribution lies. In contrast, form-oriented writers connect their sense of ownership to translation and review, as that is where they want to exercise control over stylistic elements. This view of ownership suggests a ‘chessboard-like’ pattern, where users seek AI assistance in areas outside their primary contribution. Table 3 illustrates this preference: green regions show where AI support is sought, red areas denote places where AI should not intervene, and yellow regions denote zones where AI may assist with caution.

###

6.2. Contributions to CSCW

Our work speaks directly to CSCW’s growing interest in human–AI collaboration in creative and knowledge work. While CSCW has traditionally focused on cooperation and collaboration between people—with computers serving as mediating tools—recent advances in AI have shifted this dynamic. As AI systems increasingly take on semi-autonomous roles, interactions with them begin to mirror human collaboration, carrying with them the ambiguity, social nuance, and negotiation once exclusive to human-human cooperation. Crucially, these interactions introduce new concerns around agency and ownership that our community now need to grapple with.

Recent CSCW programs reflect this shift, with dedicated sessions on Human-AI Collaboration and AI and Trust at CSCW 2023 (csc, 2023 ) , and AI in Creativity Flows and Future Dialogues on Personal AI Assistants at CSCW 2024 (csc, 2024 ) . Our work aligns with this trajectory by examining how writers interact with AI across distinct cognitive processes and writing contexts. By foregrounding the demands and boundaries writers seek to maintain, our study contributes both theoretical insight and practical design implications to CSCW’s ongoing conversations about how to build sociotechnical systems that support collaborative work—not just between humans, but with machines that now shape the creative process in increasingly social ways.

We also contribute to prior HCI research on mapping the design space of AI-assisted writing, such as Lee et al.’s 2024 exploration (Lee et al., 2024 ) , by adding granularity to the fields’ understanding of how to design for human agency. By decomposing writing into its component cognitive processes and situating them in distinct writing contexts, we surface new nuances in how agency and ownership concerns play out at the process-level. For instance, our findings enrich existing work on authenticity and ownership in AI-assisted writing. Gero et al. (Gero et al., 2023 ) found that while authenticity and ownership are related, they are not directly correlated–users may not perceive a system that mimics their style as inauthentic. Our studies complement this by revealing that for some writers, particularly form-oriented and expert writers (e.g., W12), AI mimicry of style can feel deeply invasive. As W12 shared, “I would feel a little violated . For me, personal style is so signature to who I am.”

This example illustrates the value of pairing systematic reviews with user studies that go deep into areas of interest and importance to the research community, such as our focus on preserving human agency. Within that context, our work relates to broader theories in Human-Centered AI, such as Ben Shneiderman’s HAI framework, which argues that automation and human control need not be at odds on a unidimensional spectrum (Shneiderman, 2022 ) , like in the classic 1978 characterization of automation by Sheridan and Verplank (Sheridan et al., 1978 ) . Instead, Shneiderman posits a multidimensional perspective where automation and control can increase concurrently, which resonates with our optimistic vision for AI’s role in augmenting human agency. Like Shneiderman’s multi-dimensional characterization of automation and human agency, our approach demonstrates the value of viewing creative tasks as a multi-dimensional. By breaking it down into distinct cognitive processes and contexts, we move beyond a one-size-fits-all perspective and highlight specific context × \times process dimensions where designers should focus AI support.

###

6.3. Limitations and Future Work

Our study has limitations that warrant careful consideration when interpreting the findings. Firstly, our findings are influenced by our choice of theoretical framework (Flower and Hayes, 1981 ) . While the framework is widely used in AI writing research ( (Biermann et al., 2022 ; Lee et al., 2024 ; Rapp et al., 2015 ) ) and provided a valuable lens for this study, it may not fully describe human-AI interaction in creative and professional writing. Exploring alternative or complementary frameworks in future work could yield richer interpretations and better address the collaborative human-AI or author-reader dynamics.

Secondly, our systematic review’s focus on the ACM Digital Library, while methodologically justified, presents a limitation to the comprehensiveness of our findings. Although our preliminary analysis demonstrated that the ACM Digital Library contained a substantially higher concentration of relevant papers (11%) compared to other databases (2-3%), this focused approach excludes potentially-valuable insights published in other venues. The ACM’s disciplinary focus may have oriented our findings toward certain perspectives in computing and human-computer interaction, underrepresenting interdisciplinary approaches or perspectives from adjacent fields. Future research could include additional digital libraries to develop a more comprehensive understanding of the literature landscape surrounding AI-assisted writing.

Thirdly, while our inclusion criteria was broad, allowing participants aged 18 and above, the second requirement that participants have some prior experience using AI tools for writing inadvertently limited the age diversity in our sample, resulting in a maximum age of 34. This excludes valuable insights from older adults who are also impacted by AI. Future studies could address this by incorporating a more representative age distribution to explore potential age-based differences in attitudes toward AI-assisted writing and ownership. The gender composition of our sample could be expanded to examine gender-specific perspectives. Furthermore, as our study only included participants familiar with AI, our findings are less applicable to writers with no prior familiarity. Future research could investigate the initial reactions and adoption experiences of AI-naive writers, illuminating potential barriers to entry and differing perceptions of agency in AI-assisted writing.

Finally, our interview recruitment via social media and email invitations, combined with the relatively small sample, limits the generalizability of our findings. Our convenience sampling method may have introduced selection bias by primarily reaching participants from certain networks and communities, potentially overlooking diverse perspectives from the broader population and failing to capture the full variety of writing contexts, particularly in fields like creative writing and professional communication, where there are many different forms. We partially accounted for this by being selective in our recruitment, aiming to include writers with varied experiences, but a larger sample of writers can help further deepen our understanding of AI’s role across varied writing contexts. Additionally, although our participants had experience with a variety of AI writing tools, all had used ChatGPT, with fewer using alternatives. This concentration of experience with conversational tools, particularly ChatGPT, may have influenced how participants conceptualized AI assistance and limited their understanding of the broader AI writing design space. A larger and more diverse sample of writers using a wider range of AI tools can help further deepen our understanding of AI’s role across varied writing contexts.

##

7. Conclusion

Our systematic review of AI-assisted writing research, combined with interviews with writers, shows that preserving agency and ownership in human–AI collaboration requires a nuanced understanding of when and how users seek control across writing processes and contexts. We identified four design strategies in existing research— structured guidance , guided exploration , active co-writing , and critical feedback —and found that preferences for AI involvement vary significantly depending on the writing task. Content-focused writers (e.g., academics) emphasize control over planning and ideation, while form-focused writers (e.g., creatives) value ownership in translation and revision. Drawing on contextual factors such as time pressure, trust, task importance, and perceived competence, we provide design guidance for adaptive systems that preserve user agency. This includes preferring AI suggestions over direct edits, maintaining clear authorial boundaries, and offering global and local AI toggles for modulating AI involvement. By aligning system design with the real-world needs of writers, this work lays the foundation for human-centered AI writing tools that enable true co-writing, on human terms.

Acknowledgements.

The authors acknowledge the use of ChatGPT, a generative AI tool developed by OpenAI, in the writing process of this paper. The tool was used solely to enhance the readability of specific sections. The authors retain responsibility and ownership of all core ideas, concepts, and interpretations. This usage aligns with ACM policy, which requires authors to be the ”creator or originator of an idea.”

## References

(1)

csc (2023)

2023.

CSCW 2023 Program Overview.

Accessed: 2025-04-15.

csc (2024)

2024.

CSCW 2024 Program Overview.

Accessed: 2025-04-15.

Afrin et al. (2021)

Tazin Afrin, Omid Kashefi, Christopher Olshefski, Diane Litman, Rebecca Hwa, and Amanda Godley. 2021.

Effective Interfaces for Student-Driven Revision Sessions for Argumentative Writing. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI ’21) . Association for Computing Machinery, New York, NY, USA, Article 58, 13 pages.

Allen et al. (2018)

Laura K. Allen, Aaron D. Likens, and Danielle S. McNamara. 2018.

A multi-dimensional analysis of writing flexibility in an automated writing evaluation system. In Proceedings of the 8th International Conference on Learning Analytics and Knowledge (Sydney, New South Wales, Australia) (LAK ’18) . Association for Computing Machinery, New York, NY, USA, 380–388.

Amershi et al. (2019)

Saleema Amershi, Dan Weld, Mihaela Vorvoreanu, Adam Fourney, Besmira Nushi, Penny Collisson, Jina Suh, Shamsi Iqbal, Paul N Bennett, Kori Inkpen, et al. 2019.

Guidelines for human-AI interaction. In Proceedings of the 2019 chi conference on human factors in computing systems . 1–13.

Arakawa et al. (2023)

Riku Arakawa, Hiromu Yakura, and Masataka Goto. 2023.

CatAlyst: Domain-Extensible Intervention for Preventing Task Procrastination Using Large Generative Models. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . Association for Computing Machinery, New York, NY, USA, Article 157, 19 pages.

Benharrak et al. (2024)

Karim Benharrak, Tim Zindulka, Florian Lehmann, Hendrik Heuer, and Daniel Buschek. 2024.

Writer-Defined AI Personas for On-Demand Feedback Generation. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1049, 18 pages.

Bhat et al. (2023)

Advait Bhat, Saaket Agashe, Parth Oberoi, Niharika Mohile, Ravi Jangir, and Anirudha Joshi. 2023.

Interacting with Next-Phrase Suggestions: How Suggestion Systems Aid and Influence the Cognitive Processes of Writing. In Proceedings of the 28th International Conference on Intelligent User Interfaces (Sydney, NSW, Australia) (IUI ’23) . Association for Computing Machinery, New York, NY, USA, 436–452.

Biermann et al. (2022)

Oloff C Biermann, Ning F Ma, and Dongwook Yoon. 2022.

From tool to companion: Storywriters want AI writers to respect their personal values and writing strategies. In Proceedings of the 2022 ACM Designing Interactive Systems Conference . 1209–1227.

Binns et al. (2018)

Reuben Binns, Max Van Kleek, Michael Veale, Ulrik Lyngs, Jun Zhao, and Nigel Shadbolt. 2018.

’It’s Reducing a Human Being to a Percentage’ Perceptions of Justice in Algorithmic Decisions. In Proceedings of the 2018 Chi conference on human factors in computing systems . 1–14.

Booten and Gero (2021)

Kyle Booten and Katy Ilonka Gero. 2021.

Poetry Machines: Eliciting Designs for Interactive Writing Tools from Poets. In Proceedings of the 13th Conference on Creativity and Cognition (Virtual Event, Italy) (C&C ’21) . Association for Computing Machinery, New York, NY, USA, Article 51, 5 pages.

Braun et al. (2023)

Virginia Braun, Victoria Clarke, Nikki Hayfield, Louise Davey, and Elizabeth Jenkinson. 2023.

Doing reflexive thematic analysis.

In Supporting research in counselling and psychotherapy: Qualitative, quantitative, and mixed methods research . Springer, 19–38.

Buruk (2023)

Oğuz ’Oz’ Buruk. 2023.

Academic Writing with GPT-3.5 (ChatGPT): Reflections on Practices, Efficacy and Transparency. In Proceedings of the 26th International Academic Mindtrek Conference (Tampere, Finland) (Mindtrek ’23) . Association for Computing Machinery, New York, NY, USA, 144–153.

Buschek et al. (2021)

Daniel Buschek, Martin Zürn, and Malin Eiband. 2021.

The Impact of Multiple Parallel Phrase Suggestions on Email Input and Composition Behaviour of Native and Non-Native English Writers. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI ’21) . Association for Computing Machinery, New York, NY, USA, Article 732, 13 pages.

Cai et al. (2024)

Runze Cai, Nuwan Janaka, Yang Chen, Lucia Wang, Shengdong Zhao, and Can Liu. 2024.

PANDALens: Towards AI-Assisted In-Context Writing on OHMD During Travels. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1053, 24 pages.

Cao et al. (2023)

Shiye Cao, Catalina Gomez, and Chien-Ming Huang. 2023.

How Time Pressure in Different Phases of Decision-Making Influences Human-AI Collaboration.

Proc. ACM Hum.-Comput. Interact. 7, CSCW2, Article 277 (Oct. 2023), 26 pages.

Chang et al. (2021)

Tsung-Shu Chang, Yitong Li, Hui-Wen Huang, and Beth Whitfield. 2021.

Exploring EFL Students’ Writing Performance and Their Acceptance of AI-based Automated Writing Feedback. In Proceedings of the 2021 2nd International Conference on Education Development and Studies (Hilo, HI, USA) (ICEDS ’21) . Association for Computing Machinery, New York, NY, USA, 31–35.

Chen et al. (2019)

Mia Xu Chen, Benjamin N. Lee, Gagan Bansal, Yuan Cao, Shuyuan Zhang, Justin Lu, Jackie Tsay, Yinan Wang, Andrew M. Dai, Zhifeng Chen, Timothy Sohn, and Yonghui Wu. 2019.

Gmail Smart Compose: Real-Time Assisted Writing. In Proceedings of the 25th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining (Anchorage, AK, USA) (KDD ’19) . Association for Computing Machinery, New York, NY, USA, 2287–2295.

Cheng et al. (2024)

Yixin Cheng, Kayley Lyons, Guanliang Chen, Dragan Gašević, and Zachari Swiecki. 2024.

Evidence-centered Assessment for Writing with Generative AI. In Proceedings of the 14th Learning Analytics and Knowledge Conference (Kyoto, Japan) (LAK ’24) . Association for Computing Machinery, New York, NY, USA, 178–188.

Choe et al. (2024)

Kiroong Choe, Seokhyeon Park, Seokweon Jung, Hyeok Kim, Ji Won Yang, Hwajung Hong, and Jinwook Seo. 2024.

Supporting Novice Researchers to Write Literature Review using Language Models. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 307, 9 pages.

Choi et al. (2024)

Seulgi Choi, Hyewon Lee, Yoonjoo Lee, and Juho Kim. 2024.

VIVID: Human-AI Collaborative Authoring of Vicarious Dialogues from Lecture Videos. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 277, 26 pages.

Chung et al. (2022)

John Joon Young Chung, Wooseok Kim, Kang Min Yoo, Hwaran Lee, Eytan Adar, and Minsuk Chang. 2022.

TaleBrush: Sketching Stories with Generative Pretrained Language Models. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . Association for Computing Machinery, New York, NY, USA, Article 209, 19 pages.

Cila (2022)

Nazli Cila. 2022.

Designing Human-Agent Collaborations: Commitment, responsiveness, and support. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . Association for Computing Machinery, New York, NY, USA, Article 420, 18 pages.

Clark et al. (2018)

Elizabeth Clark, Anne Spencer Ross, Chenhao Tan, Yangfeng Ji, and Noah A. Smith. 2018.

Creative Writing with a Machine in the Loop: Case Studies on Slogans and Stories. In Proceedings of the 23rd International Conference on Intelligent User Interfaces (Tokyo, Japan) (IUI ’18) . Association for Computing Machinery, New York, NY, USA, 329–340.

Cremaschi et al. (2023)

Michele Cremaschi, Maria Menendez-Blanco, and Antonella De Angeli. 2023.

Demo: ISOTTA - A Slow Exploration of Power Relations in Writing with Language Models. In Proceedings of the 15th Biannual Conference of the Italian SIGCHI Chapter (Torino, Italy) (CHItaly ’23) . Association for Computing Machinery, New York, NY, USA, Article 58, 5 pages.

Dang et al. (2022)

Hai Dang, Karim Benharrak, Florian Lehmann, and Daniel Buschek. 2022.

Beyond Text Generation: Supporting Writers with Continuous Automatic Text Summaries. In Proceedings of the 35th Annual ACM Symposium on User Interface Software and Technology (Bend, OR, USA) (UIST ’22) . Association for Computing Machinery, New York, NY, USA, Article 98, 13 pages.

Dang et al. (2023)

Hai Dang, Sven Goller, Florian Lehmann, and Daniel Buschek. 2023.

Choice Over Control: How Users Write with Large Language Models using Diegetic and Non-Diegetic Prompting. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . Association for Computing Machinery, New York, NY, USA, Article 408, 17 pages.

Darvishi et al. (2022)

Ali Darvishi, Hassan Khosravi, Solmaz Abdi, Shazia Sadiq, and Dragan Gašević. 2022.

Incorporating Training, Self-monitoring and AI-Assistance to Improve Peer Feedback Quality. In Proceedings of the Ninth ACM Conference on Learning @ Scale (New York City, NY, USA) (L@S ’22) . Association for Computing Machinery, New York, NY, USA, 35–47.

Dhillon et al. (2024)

Paramveer S. Dhillon, Somayeh Molaei, Jiaqi Li, Maximilian Golub, Shaochun Zheng, and Lionel Peter Robert. 2024.

Shaping Human-AI Collaboration: Varied Scaffolding Levels in Co-writing with Language Models. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1044, 18 pages.

Di Fede et al. (2022)

Giulia Di Fede, Davide Rocchesso, Steven P. Dow, and Salvatore Andolina. 2022.

The Idea Machine: LLM-based Expansion, Rewriting, Combination, and Suggestion of Ideas. In Proceedings of the 14th Conference on Creativity and Cognition (Venice, Italy) (C&C ’22) . Association for Computing Machinery, New York, NY, USA, 623–627.

Diloy et al. (2024)

Marlon A. Diloy, Cyrix Pearl E. Comparativo, John Carl T. Reyes, Berna Jhane M. Eusebio, and Lance Ian C. Morona. 2024.

Exploring the Landscape of AI Tools in Student Learning: An analysis of commonly utilized AI Tools at a university in the Philippines. In Proceedings of the 2023 6th Artificial Intelligence and Cloud Computing Conference (Kyoto, Japan) (AICCC ’23) . Association for Computing Machinery, New York, NY, USA, 266–271.

Ding et al. (2023)

Zijian Ding, Arvind Srinivasan, Stephen Macneil, and Joel Chan. 2023.

Fluid Transformers and Creative Analogies: Exploring Large Language Models’ Capacity for Augmenting Cross-Domain Analogical Creativity. In Proceedings of the 15th Conference on Creativity and Cognition (Virtual Event, USA) (C&C ’23) . Association for Computing Machinery, New York, NY, USA, 489–505.

Draxler et al. (2024a)

Fiona Draxler, Anna Werner, Florian Lehmann, Matthias Hoppe, Albrecht Schmidt, Daniel Buschek, and Robin Welsch. 2024a.

The AI Ghostwriter Effect: When Users do not Perceive Ownership of AI-Generated Text but Self-Declare as Authors.

ACM Trans. Comput.-Hum. Interact. 31, 2, Article 25 (Feb. 2024), 40 pages.

Draxler et al. (2024b)

Fiona Draxler, Anna Werner, Florian Lehmann, Matthias Hoppe, Albrecht Schmidt, Daniel Buschek, and Robin Welsch. 2024b.

The AI ghostwriter effect: When users do not perceive ownership of AI-generated text but self-declare as authors.

ACM Transactions on Computer-Human Interaction 31, 2 (2024), 1–40.

Flower and Hayes (1981)

Linda Flower and John R. Hayes. 1981.

A Cognitive Process Theory of Writing.

College Composition and Communication 32, 4 (1981), 365–387.

Fu et al. (2023)

Liye Fu, Benjamin Newman, Maurice Jakesch, and Sarah Kreps. 2023.

Comparing Sentence-Level Suggestions to Message-Level Suggestions in AI-Mediated Communication. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . Association for Computing Machinery, New York, NY, USA, Article 103, 13 pages.

Gero and Chilton (2019)

Katy Ilonka Gero and Lydia B. Chilton. 2019.

Metaphoria: An Algorithmic Companion for Metaphor Creation. In Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (Glasgow, Scotland Uk) (CHI ’19) . Association for Computing Machinery, New York, NY, USA, 1–12.

Gero et al. (2022)

Katy Ilonka Gero, Vivian Liu, and Lydia Chilton. 2022.

Sparks: Inspiration for Science Writing using Language Models. In Proceedings of the 2022 ACM Designing Interactive Systems Conference (Virtual Event, Australia) (DIS ’22) . Association for Computing Machinery, New York, NY, USA, 1002–1019.

Gero et al. (2023)

Katy Ilonka Gero, Tao Long, and Lydia B Chilton. 2023.

Social Dynamics of AI Support in Creative Writing. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . Association for Computing Machinery, New York, NY, USA, Article 245, 15 pages.

Ghai and Mueller (2021)

Bhavya Ghai and Klaus Mueller. 2021.

Fluent: An AI Augmented Writing Tool for People who Stutter. In Proceedings of the 23rd International ACM SIGACCESS Conference on Computers and Accessibility (Virtual Event, USA) (ASSETS ’21) . Association for Computing Machinery, New York, NY, USA, Article 26, 8 pages.

Ghajargar et al. (2022)

Maliheh Ghajargar, Jeffrey Bardzell, and Love Lagerkvist. 2022.

A Redhead Walks into a Bar: Experiences of Writing Fiction with Artificial Intelligence. In Proceedings of the 25th International Academic Mindtrek Conference (Tampere, Finland) (Academic Mindtrek ’22) . Association for Computing Machinery, New York, NY, USA, 230–241.

Goel et al. (2023)

Toshali Goel, Orit Shaer, Catherine Delcourt, Quan Gu, and Angel Cooper. 2023.

Preparing Future Designers for Human-AI Collaboration in Persona Creation. In Proceedings of the 2nd Annual Meeting of the Symposium on Human-Computer Interaction for Work (Oldenburg, Germany) (CHIWORK ’23) . Association for Computing Machinery, New York, NY, USA, Article 4, 14 pages.

Goodman et al. (2022)

Steven M. Goodman, Erin Buehler, Patrick Clary, Andy Coenen, Aaron Donsbach, Tiffanie N. Horne, Michal Lahav, Robert MacDonald, Rain Breaw Michaels, Ajit Narayanan, Mahima Pushkarna, Joel Riley, Alex Santana, Lei Shi, Rachel Sweeney, Phil Weaver, Ann Yuan, and Meredith Ringel Morris. 2022.

LaMPost: Design and Evaluation of an AI-assisted Email Writing Prototype for Adults with Dyslexia. In Proceedings of the 24th International ACM SIGACCESS Conference on Computers and Accessibility (Athens, Greece) (ASSETS ’22) . Association for Computing Machinery, New York, NY, USA, Article 24, 18 pages.

Guo et al. (2024)

Alicia Guo, Pat Pataranutaporn, and Pattie Maes. 2024.

Exploring the Impact of AI Value Alignment in Collaborative Ideation: Effects on Perception, Ownership, and Output. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 152, 11 pages.

Han et al. (2024)

Jiyeon Han, Jimin Park, Jinyoung Huh, Uran Oh, Jaeyoung Do, and Daehee Kim. 2024.

AscleAI: A LLM-based Clinical Note Management System for Enhancing Clinician Productivity. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 50, 7 pages.

Han et al. (2023)

Jieun Han, Haneul Yoo, Yoonsu Kim, Junho Myung, Minsun Kim, Hyunseung Lim, Juho Kim, Tak Yeon Lee, Hwajung Hong, So-Yeon Ahn, and Alice Oh. 2023.

RECIPE: How to Integrate ChatGPT into EFL Writing Education. In Proceedings of the Tenth ACM Conference on Learning @ Scale (Copenhagen, Denmark) (L@S ’23) . Association for Computing Machinery, New York, NY, USA, 416–420.

Hauptman et al. (2022)

Allyson I. Hauptman, Wen Duan, and Nathan J. Mcneese. 2022.

The Components of Trust for Collaborating With AI Colleagues. In Companion Publication of the 2022 Conference on Computer Supported Cooperative Work and Social Computing (Virtual Event, Taiwan) (CSCW’22 Companion) . Association for Computing Machinery, New York, NY, USA, 72–75.

Hayes (1996)

John R. Hayes. 1996.

A new framework for understanding cognition and affect in writing.

In The science of writing: Theories, methods, individual differences, and applications . Lawrence Erlbaum Associates, Inc, Hillsdale, NJ, US, 1–27.

Hayes and Nash (1996)

John R. Hayes and Jane Gradwohl Nash. 1996.

On the nature of planning in writing.

In The science of writing: Theories, methods, individual differences, and applications . Lawrence Erlbaum Associates, Inc, Hillsdale, NJ, US, 29–55.

Hoque et al. (2024)

Md Naimul Hoque, Tasfia Mashiat, Bhavya Ghai, Cecilia D. Shelton, Fanny Chevalier, Kari Kraus, and Niklas Elmqvist. 2024.

The HaLLMark Effect: Supporting Provenance and Transparent Use of Large Language Models in Writing with Interactive Visualization. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1045, 15 pages.

Huang et al. (2020)

Hui-Wen Huang, Zehui Li, and Linda Taylor. 2020.

The Effectiveness of Using Grammarly to Improve Students’ Writing Skills. In Proceedings of the 5th International Conference on Distance Education and Learning (Beijing, China) (ICDEL ’20) . Association for Computing Machinery, New York, NY, USA, 122–127.

Hupont et al. (2024)

Isabelle Hupont, Marina Wainer, Sam Nester, Sylvie Tissot, Lucía Iglesias-Blanco, and Sandra Baldassarri. 2024.

Synocene, Beyond the Anthropocene: De-Anthropocentralising Human-Nature-AI Interaction. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 532, 9 pages.

Inie et al. (2023)

Nanna Inie, Jeanette Falk, and Steve Tanimoto. 2023.

Designing Participatory AI: Creative Professionals’ Worries and Expectations about Generative AI. In Extended Abstracts of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI EA ’23) . Association for Computing Machinery, New York, NY, USA, Article 82, 8 pages.

Ippolito et al. (2022)

Daphne Ippolito, Ann Yuan, Andy Coenen, and Sehmon Burnam. 2022.

Creative Writing with an AI-Powered Writing Assistant: Perspectives from Professional Writers.

Ito et al. (2023)

Takumi Ito, Naomi Yamashita, Tatsuki Kuribayashi, Masatoshi Hidaka, Jun Suzuki, Ge Gao, Jack Jamieson, and Kentaro Inui. 2023.

Use of an AI-powered Rewriting Support Software in Context with Other Tools: A Study of Non-Native English Speakers. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST ’23) . Association for Computing Machinery, New York, NY, USA, Article 45, 13 pages.

Jahanbakhsh et al. (2022)

Farnaz Jahanbakhsh, Elnaz Nouri, Robert Sim, Ryen W. White, and Adam Fourney. 2022.

Understanding Questions that Arise When Working with Business Documents.

Proc. ACM Hum.-Comput. Interact. 6, CSCW2, Article 341 (Nov. 2022), 24 pages.

Jakesch et al. (2023)

Maurice Jakesch, Advait Bhat, Daniel Buschek, Lior Zalmanson, and Mor Naaman. 2023.

Co-Writing with Opinionated Language Models Affects Users’ Views. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . Association for Computing Machinery, New York, NY, USA, Article 111, 15 pages.

Janaka et al. (2024)

Nuwan Janaka, Runze Cai, Shengdong Zhao, and David Hsu. 2024.

Demonstrating PANDALens: Enhancing Daily Activity Documentation with AI-assisted In-Context Writing on OHMD. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 397, 7 pages.

Kariyawasam et al. (2024)

Hasindu Kariyawasam, Amashi Niwarthana, Alister Palmer, Judy Kay, and Anusha Withana. 2024.

Appropriate Incongruity Driven Human-AI Collaborative Tool to Assist Novices in Humorous Content Generation. In Proceedings of the 29th International Conference on Intelligent User Interfaces (Greenville, SC, USA) (IUI ’24) . Association for Computing Machinery, New York, NY, USA, 650–659.

KELLOGG (1987)

RONALD T. KELLOGG. 1987.

Writing Performance: Effects of Cognitive Strategies.

Written Communication 4, 3 (1987), 269–298.

arXiv:https://doi.org/10.1177/0741088387004003003

Kim et al. (2022)

Jini Kim, Chorong Kim, and Ki-Young Nam. 2022.

ThinkWrite: Design Interventions for Empowering User Deliberation in Online Petition. In Extended Abstracts of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI EA ’22) . Association for Computing Machinery, New York, NY, USA, Article 428, 8 pages.

Kim et al. (2023b)

Jeongyeon Kim, Sangho Suh, Lydia B Chilton, and Haijun Xia. 2023b.

Metaphorian: Leveraging Large Language Models to Support Extended Metaphor Creation for Science Writing. In Proceedings of the 2023 ACM Designing Interactive Systems Conference (Pittsburgh, PA, USA) (DIS ’23) . Association for Computing Machinery, New York, NY, USA, 115–135.

Kim et al. (2024a)

Taewook Kim, Hyomin Han, Eytan Adar, Matthew Kay, and John Joon Young Chung. 2024a.

Authors’ Values and Attitudes Towards AI-bridged Scalable Personalization of Creative Language Arts. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 31, 16 pages.

Kim et al. (2019)

Taewook Kim, Jung Soo Lee, Zhenhui Peng, and Xiaojuan Ma. 2019.

Love in lyrics: An exploration of supporting textual manifestation of affection in social messaging.

Proceedings of the ACM on Human-Computer Interaction 3, CSCW (2019), 1–27.

Kim et al. (2024b)

Taewan Kim, Donghoon Shin, Young-Ho Kim, and Hwajung Hong. 2024b.

DiaryMate: Understanding User Perceptions and Experience in Human-AI Collaboration for Personal Journaling. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1046, 15 pages.

Kim et al. (2023a)

Tae Soo Kim, Yoonjoo Lee, Minsuk Chang, and Juho Kim. 2023a.

Cells, Generators, and Lenses: Design Framework for Object-Oriented Interaction with Large Language Models. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST ’23) . Association for Computing Machinery, New York, NY, USA, Article 4, 18 pages.

King and Brooks (2017)

Nigel King and Joanna M. Brooks. 2017.

Template Analysis for Business and Management Students.

SAGE Publications Ltd, 55 City Road, London, 25–46.

Knittel et al. (2019)

Megan Knittel, Shelby Pitts, and Rick Wash. 2019.

” The Most Trustworthy Coin” How Ideological Tensions Drive Trust in Bitcoin.

Proceedings of the ACM on Human-Computer Interaction 3, CSCW (2019), 1–23.

Kobiella et al. (2024)

Charlotte Kobiella, Yarhy Said Flores López, Franz Waltenberger, Fiona Draxler, and Albrecht Schmidt. 2024.

”If the Machine Is As Good As Me, Then What Use Am I?” – How the Use of ChatGPT Changes Young Professionals’ Perception of Productivity and Accomplishment. In Proceedings of the CHI Conference on Human Factors in Computing Systems . ACM, Honolulu HI USA, 1–16.

Kreminski et al. (2020)

Max Kreminski, Melanie Dickinson, Michael Mateas, and Noah Wardrip-Fruin. 2020.

Why Are We Like This?: The AI Architecture of a Co-Creative Storytelling Game. In Proceedings of the 15th International Conference on the Foundations of Digital Games (Bugibba, Malta) (FDG ’20) . Association for Computing Machinery, New York, NY, USA, Article 13, 4 pages.

Laban et al. (2024)

Philippe Laban, Jesse Vig, Marti Hearst, Caiming Xiong, and Chien-Sheng Wu. 2024.

Beyond the chat: Executable and verifiable text-editing with llms. In Proceedings of the 37th Annual ACM Symposium on User Interface Software and Technology . 1–23.

Lee et al. (2024)

Mina Lee, Katy Ilonka Gero, John Joon Young Chung, Simon Buckingham Shum, Vipul Raheja, Hua Shen, Subhashini Venugopalan, Thiemo Wambsganss, David Zhou, Emad A Alghamdi, et al. 2024.

A Design Space for Intelligent and Interactive Writing Assistants. In Proceedings of the CHI Conference on Human Factors in Computing Systems . 1–35.

Lee et al. (2022)

Mina Lee, Percy Liang, and Qian Yang. 2022.

Coauthor: Designing a human-ai collaborative writing dataset for exploring language model capabilities. In Proceedings of the 2022 CHI conference on human factors in computing systems . 1–19.

Lehmann et al. (2022)

Florian Lehmann, Niklas Markert, Hai Dang, and Daniel Buschek. 2022.

Suggestion Lists vs. Continuous Generation: Interaction Design for Writing with Generative Models on Mobile Devices Affect Text Length, Wording and Perceived Authorship. In Proceedings of Mensch Und Computer 2022 (Darmstadt, Germany) (MuC ’22) . Association for Computing Machinery, New York, NY, USA, 192–208.

Li and Wang (2024)

Huiting Li and Yakun Wang. 2024.

The Empowerment and Impact of ChatGPT Technology on Foreign Language Education in Colleges and Universities. In Proceedings of the 2023 6th International Conference on Educational Technology Management (Guangzhou, China) (ICETM ’23) . Association for Computing Machinery, New York, NY, USA, 29–34.

Li et al. (2024)

Zhuoyan Li, Chen Liang, Jing Peng, and Ming Yin. 2024.

The Value, Benefits, and Concerns of Generative AI-Powered Assistance in Writing. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1048, 25 pages.

Liapis et al. (2023)

Antonios Liapis, Christian Guckelsberger, Jichen Zhu, Casper Harteveld, Simone Kriglstein, Alena Denisova, Jeremy Gow, and Mike Preuss. 2023.

Designing for Playfulness in Human-AI Authoring Tools. In Proceedings of the 18th International Conference on the Foundations of Digital Games (Lisbon, Portugal) (FDG ’23) . Association for Computing Machinery, New York, NY, USA, Article 75, 4 pages.

Lin et al. (2024)

Susan Lin, Jeremy Warner, J.D. Zamfirescu-Pereira, Matthew G Lee, Sauhard Jain, Shanqing Cai, Piyawat Lertvittayakumjorn, Michael Xuelin Huang, Shumin Zhai, Bjoern Hartmann, and Can Liu. 2024.

Rambler: Supporting Writing With Speech via LLM-Assisted Gist Manipulation. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1043, 19 pages.

Liu et al. (2022)

Yihe Liu, Anushk Mittal, Diyi Yang, and Amy Bruckman. 2022.

Will AI Console Me when I Lose my Pet? Understanding Perceptions of AI-Mediated Email Writing. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . Association for Computing Machinery, New York, NY, USA, Article 474, 13 pages.

Maiden et al. (2019)

Neil Maiden, Konstantinos Zachos, Amanda Brown, Lars Nyre, Balder Holm, Aleksander Nygård Tonheim, Claus Hesseling, Andrea Wagemans, and Dimitris Apostolou. 2019.

Evaluating the Use of Digital Creativity Support by Journalists in Newsrooms. In Proceedings of the 2019 Conference on Creativity and Cognition (San Diego, CA, USA) (C&C ’19) . Association for Computing Machinery, New York, NY, USA, 222–232.

McHugh (2012)

Mary L. McHugh. 2012.

Interrater reliability: the kappa statistic.

Biochemia Medica 22, 3 (2012), 276–282.

Mirowski et al. (2023)

Piotr Mirowski, Kory W. Mathewson, Jaylen Pittman, and Richard Evans. 2023.

Co-Writing Screenplays and Theatre Scripts with Language Models: Evaluation by Industry Professionals. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI ’23) . Association for Computing Machinery, New York, NY, USA, Article 355, 34 pages.

Mollick and Mollick (2024)

Ethan Mollick and Ethan Mollick. 2024.

Co-Intelligence .

Random House UK.

Moruzzi and Margarido (2024)

Caterina Moruzzi and Solange Margarido. 2024.

A User-centered Framework for Human-AI Co-creativity. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 25, 9 pages.

Muller and Weisz (2022)

Michael Muller and Justin Weisz. 2022.

Extending a Human-AI Collaboration Framework with Dynamism and Sociality. In Proceedings of the 1st Annual Meeting of the Symposium on Human-Computer Interaction for Work (Durham, NH, USA) (CHIWORK ’22) . Association for Computing Machinery, New York, NY, USA, Article 10, 12 pages.

Neshaei et al. (2024)

Seyed Parsa Neshaei, Roman Rietsche, Xiaotian Su, and Thiemo Wambsganss. 2024.

Enhancing Peer Review with AI-Powered Suggestion Generation Assistance: Investigating the Design Dynamics. In Proceedings of the 29th International Conference on Intelligent User Interfaces (Greenville, SC, USA) (IUI ’24) . Association for Computing Machinery, New York, NY, USA, 88–102.

Neyem et al. (2024)

Andres Neyem, Juan Pablo Sandoval Alcocer, Marcelo Mendoza, Leonardo Centellas-Claros, Luis A. Gonzalez, and Carlos Paredes-Robles. 2024.

Exploring the Impact of Generative AI for StandUp Report Recommendations in Software Capstone Project Development. In Proceedings of the 55th ACM Technical Symposium on Computer Science Education V. 1 (Portland, OR, USA) (SIGCSE 2024) . Association for Computing Machinery, New York, NY, USA, 951–957.

Nichols et al. (2020)

Eric Nichols, Leo Gao, and Randy Gomez. 2020.

Collaborative Storytelling with Large-scale Neural Language Models. In Proceedings of the 13th ACM SIGGRAPH Conference on Motion, Interaction and Games (Virtual Event, SC, USA) (MIG ’20) . Association for Computing Machinery, New York, NY, USA, Article 17, 10 pages.

Nouri et al. (2023)

Zahra Nouri, Nikhil Prakash, Ujwal Gadiraju, and Henning Wachsmuth. 2023.

Supporting Requesters in Writing Clear Crowdsourcing Task Descriptions Through Computational Flaw Assessment. In Proceedings of the 28th International Conference on Intelligent User Interfaces (Sydney, NSW, Australia) (IUI ’23) . Association for Computing Machinery, New York, NY, USA, 737–749.

NYSTRAND (1989)

MARTIN NYSTRAND. 1989.

A Social-Interactive Model of Writing.

Written Communication 6, 1 (1989), 66–85.

arXiv:ttps://doi.org/10.1177/0741088389006001005

Osone et al. (2021)

Hiroyuki Osone, Jun-Li Lu, and Yoichi Ochiai. 2021.

BunCho: AI Supported Story Co-Creation via Unsupervised Multitask Learning to Increase Writers’ Creativity in Japanese. In Extended Abstracts of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI EA ’21) . Association for Computing Machinery, New York, NY, USA, Article 19, 10 pages.

Page et al. (2021)

Matthew J Page, Joanne E McKenzie, Patrick M Bossuyt, Isabelle Boutron, Tammy C Hoffmann, Cynthia D Mulrow, Larissa Shamseer, Jennifer M Tetzlaff, Elie A Akl, Sue E Brennan, Roger Chou, Julie Glanville, Jeremy M Grimshaw, Asbjørn Hróbjartsson, Manoj M Lalu, Tianjing Li, Elizabeth W Loder, Evan Mayo-Wilson, Steve McDonald, Luke A McGuinness, Lesley A Stewart, James Thomas, Andrea C Tricco, Vivian A Welch, Penny Whiting, and David Moher. 2021.

The PRISMA 2020 statement: an updated guideline for reporting systematic reviews.

BMJ 372 (2021).

arXiv:https://www.bmj.com/content/372/bmj.n71.full.pdf

Park and Ahn (2024)

Hyanghee Park and Daehwan Ahn. 2024.

The Promise and Peril of ChatGPT in Higher Education: Opportunities, Challenges, and Design Implications. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 271, 21 pages.

Peng et al. (2020)

Zhenhui Peng, Qingyu Guo, Ka Wing Tsang, and Xiaojuan Ma. 2020.

Exploring the Effects of Technological Writing Assistance for Support Providers in Online Mental Health Community. In Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’20) . Association for Computing Machinery, New York, NY, USA, 1–15.

Peng et al. (2023)

Zhenhui Peng, Xingbo Wang, Qiushi Han, Junkai Zhu, Xiaojuan Ma, and Huamin Qu. 2023.

Storyfier: Exploring Vocabulary Learning Support with Text Generation Models. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST ’23) . Association for Computing Machinery, New York, NY, USA, Article 46, 16 pages.

Pereira and Barcina (2019)

Juanan Pereira and Mikel Alejo Barcina. 2019.

A chatbot assistant for writing good quality technical reports. In Proceedings of the Seventh International Conference on Technological Ecosystems for Enhancing Multiculturality (León, Spain) (TEEM’19) . Association for Computing Machinery, New York, NY, USA, 59–64.

Poddar et al. (2023)

Ritika Poddar, Rashmi Sinha, Mor Naaman, and Maurice Jakesch. 2023.

AI Writing Assistants Influence Topic Choice in Self-Presentation. In Extended Abstracts of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI EA ’23) . Association for Computing Machinery, New York, NY, USA, Article 29, 6 pages.

Qin et al. (2024)

Hua Xuan Qin, Shan Jin, Ze Gao, Mingming Fan, and Pan Hui. 2024.

CharacterMeet: Supporting Creative Writers’ Entire Story Character Construction Processes Through Conversation with LLM-Powered Chatbot Avatars. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 1051, 19 pages.

Ram et al. (2021)

Naveen Ram, Tanay Gummadi, Rahul Bhethanabotla, Richard J Savery, and Gil Weinberg. 2021.

Say What? Collaborative Pop Lyric Generation Using Multitask Transfer Learning. In Proceedings of the 9th International Conference on Human-Agent Interaction (Virtual Event, Japan) (HAI ’21) . Association for Computing Machinery, New York, NY, USA, 165–173.

Rapp et al. (2015)

Christian Rapp, Otto Kruse, Jennifer Erlemann, and Jakob Ott. 2015.

Thesis Writer: A System for Supporting Academic Writing. In Proceedings of the 18th ACM Conference Companion on Computer Supported Cooperative Work & Social Computing . 57–60.

Rawat et al. (2024)

Swati Rawat, Sumit Mittal, Deepa Nehra, Chandani Sharma, and Dalip Kamboj. 2024.

Exploring the Potential of ChatGPT to improve experiential learning in Education. In Proceedings of the 5th International Conference on Information Management & Machine Intelligence (Jaipur, India) (ICIMMI ’23) . Association for Computing Machinery, New York, NY, USA, Article 83, 8 pages.

Resch and Yankova (2019)

Olaf Resch and Aglika Yankova. 2019.

Open knowledge interface: a digital assistant to support students in writing academic assignments. In Proceedings of the 1st ACM SIGSOFT International Workshop on Education through Advanced Software Engineering and Artificial Intelligence (Tallinn, Estonia) (EASEAI 2019) . Association for Computing Machinery, New York, NY, USA, 13–16.

Reza et al. (2024)

Mohi Reza, Nathan M Laundry, Ilya Musabirov, Peter Dushniku, Zhi Yuan “Michael” Yu, Kashish Mittal, Tovi Grossman, Michael Liut, Anastasia Kuzminykh, and Joseph Jay Williams. 2024.

ABScribe: Rapid Exploration & Organization of Multiple Writing Variations in Human-AI Co-Writing Tasks using Large Language Models. In Proceedings of the CHI Conference on Human Factors in Computing Systems . 1–18.

Rezwana and Maher (2023)

Jeba Rezwana and Mary Lou Maher. 2023.

User Perspectives on Ethical Challenges in Human-AI Co-Creativity: A Design Fiction Study. In Proceedings of the 15th Conference on Creativity and Cognition (Virtual Event, USA) (C&C ’23) . Association for Computing Machinery, New York, NY, USA, 62–74.

Robertson et al. (2021)

Ronald E Robertson, Alexandra Olteanu, Fernando Diaz, Milad Shokouhi, and Peter Bailey. 2021.

“I Can’t Reply with That”: Characterizing Problematic Email Reply Suggestions. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI ’21) . Association for Computing Machinery, New York, NY, USA, Article 724, 18 pages.

Roemmele and Gordon (2015)

Melissa Roemmele and Andrew Gordon. 2015.

Creative Help: A Story Writing Assistant. 81–92.

Rohman (1965)

D. Gordon Rohman. 1965.

Pre-Writing the Stage of Discovery in the Writing Process.

College Composition and Communication 16, 2 (1965), 106–112.

Sarrafzadeh et al. (2021)

Bahareh Sarrafzadeh, Sujay Kumar Jauhar, Michael Gamon, Edward Lank, and Ryen W. White. 2021.

Characterizing Stage-aware Writing Assistance for Collaborative Document Authoring.

Proc. ACM Hum.-Comput. Interact. 4, CSCW3, Article 271 (Jan. 2021), 29 pages.

Schmidt (2020)

Dirk Schmidt. 2020.

Grading Tibetan Children’s Literature: A Test Case Using the NLP Readability Tool “Dakje”.

ACM Trans. Asian Low-Resour. Lang. Inf. Process. 19, 6, Article 75 (Oct. 2020), 19 pages.

Schmitt and Buschek (2021)

Oliver Schmitt and Daniel Buschek. 2021.

CharacterChat: Supporting the Creation of Fictional Characters through Conversation and Progressive Manifestation with a Chatbot. In Proceedings of the 13th Conference on Creativity and Cognition (Virtual Event, Italy) (C&C ’21) . Association for Computing Machinery, New York, NY, USA, Article 10, 10 pages.

Shaer et al. (2024)

Orit Shaer, Angelora Cooper, Osnat Mokryn, Andrew L Kun, and Hagit Ben Shoshan. 2024.

AI-Augmented Brainwriting: Investigating the use of LLMs in group ideation. In Proceedings of the CHI Conference on Human Factors in Computing Systems . 1–17.

Shakeri et al. (2021)

Hanieh Shakeri, Carman Neustaedter, and Steve DiPaola. 2021.

SAGA: Collaborative Storytelling with GPT-3. In Companion Publication of the 2021 Conference on Computer Supported Cooperative Work and Social Computing (Virtual Event, USA) (CSCW ’21 Companion) . Association for Computing Machinery, New York, NY, USA, 163–166.

Shen et al. (2023)

Hua Shen, Chieh-Yang Huang, Tongshuang Wu, and Ting-Hao Kenneth Huang. 2023.

ConvXAI: Delivering Heterogeneous AI Explanations via Conversations to Support Human-AI Scientific Writing. In Companion Publication of the 2023 Conference on Computer Supported Cooperative Work and Social Computing (Minneapolis, MN, USA) (CSCW ’23 Companion) . Association for Computing Machinery, New York, NY, USA, 384–387.

Sheridan et al. (1978)

Thomas B Sheridan, William L Verplank, and TL Brooks. 1978.

Human/computer control of undersea teleoperators. In NASA. Ames Res. Center The 14th Ann. Conf. on Manual Control .

Shibani et al. (2024)

Antonette Shibani, Simon Knight, Kirsty Kitto, Ajanie Karunanayake, and Simon Buckingham Shum. 2024.

Untangling Critical Interaction with AI in Students’ Written Assessment. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA ’24) . Association for Computing Machinery, New York, NY, USA, Article 357, 6 pages.

Shin et al. (2022)

Donghoon Shin, Subeen Park, Esther Hehsun Kim, Soomin Kim, Jinwook Seo, and Hwajung Hong. 2022.

Exploring the Effects of AI-assisted Emotional Support Processes in Online Mental Health Community. In Extended Abstracts of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI EA ’22) . Association for Computing Machinery, New York, NY, USA, Article 300, 7 pages.

Shneiderman (2022)

Ben Shneiderman. 2022.

Human-centered AI: ensuring human control while increasing automation. In Proceedings of the 5th Workshop on Human Factors in Hypertext . 1–2.

Si et al. (2024)

Chenglei Si, Diyi Yang, and Tatsunori Hashimoto. 2024.

Can LLMs Generate Novel Research Ideas?

arXiv preprint arXiv:2409.04109 (2024).

Singh et al. (2024a)

Anjali Singh, Christopher Brooks, Xu Wang, Warren Li, Juho Kim, and Deepti Wilson. 2024a.

Bridging Learnersourcing and AI: Exploring the Dynamics of Student-AI Collaborative Feedback Generation. In Proceedings of the 14th Learning Analytics and Knowledge Conference (Kyoto, Japan) (LAK ’24) . Association for Computing Machinery, New York, NY, USA, 742–748.

Singh et al. (2023)

Nikhil Singh, Guillermo Bernal, Daria Savchenko, and Elena L. Glassman. 2023.

Where to Hide a Stolen Elephant: Leaps in Creative Writing with Multimodal Machine Intelligence.

ACM Trans. Comput.-Hum. Interact. 30, 5, Article 68 (Sept. 2023), 57 pages.

Singh et al. (2024b)

Nikhil Singh, Lucy Lu Wang, and Jonathan Bragg. 2024b.

FigurA11y: AI Assistance for Writing Scientific Alt Text. In Proceedings of the 29th International Conference on Intelligent User Interfaces (Greenville, SC, USA) (IUI ’24) . Association for Computing Machinery, New York, NY, USA, 886–906.

Suh et al. (2024)

Sangho Suh, Meng Chen, Bryan Min, Toby Jia-Jun Li, and Haijun Xia. 2024.

Luminate: Structured Generation and Exploration of Design Space with Large Language Models for Human-AI Co-Creation. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 644, 26 pages.

Sun et al. (2024)

Lu Sun, Stone Tao, Junjie Hu, and Steven P. Dow. 2024.

MetaWriter: Exploring the Potential and Perils of AI Writing Support in Scientific Peer Review.

Proc. ACM Hum.-Comput. Interact. 8, CSCW1, Article 94 (April 2024), 32 pages.

Swanson and Gordon (2012)

Reid Swanson and Andrew Gordon. 2012.

Say Anything.

ACM Transactions on Interactive Intelligent Systems 2 (09 2012), 1–35.

Taiye et al. (2024)

Mohammed Taiye, Christopher High, Johanna Velander, Khaled Matar, Rihards Okmanis, and Marcelo Milrad. 2024.

Generative AI-Enhanced Academic Writing: A Stakeholder-Centric Approach for the Design and Development of CHAT4ISP-AI. In Proceedings of the 39th ACM/SIGAPP Symposium on Applied Computing (Avila, Spain) (SAC ’24) . Association for Computing Machinery, New York, NY, USA, 74–80.

Tang et al. (2024)

Yuying Tang, Ningning Zhang, Mariana Ciancia, and Zhigang Wang. 2024.

Exploring the Impact of AI-generated Image Tools on Professional and Non-professional Users in the Art and Design Fields. In Companion Publication of the 2024 Conference on Computer-Supported Cooperative Work and Social Computing (San Jose, Costa Rica) (CSCW Companion ’24) . Association for Computing Machinery, New York, NY, USA, 451–458.

Tholander and Jonsson (2023)

Jakob Tholander and Martin Jonsson. 2023.

Design Ideation with AI - Sketching, Thinking and Talking with Generative Machine Learning Models. In Proceedings of the 2023 ACM Designing Interactive Systems Conference (Pittsburgh, PA, USA) (DIS ’23) . Association for Computing Machinery, New York, NY, USA, 1930–1940.

Vaswani et al. (2017)

Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N Gomez, Ł ukasz Kaiser, and Illia Polosukhin. 2017.

Attention is All you Need. In Advances in Neural Information Processing Systems , I. Guyon, U. Von Luxburg, S. Bengio, H. Wallach, R. Fergus, S. Vishwanathan, and R. Garnett (Eds.), Vol. 30. Curran Associates, Inc.

Wambsganss et al. (2021)

Thiemo Wambsganss, Tobias Kueng, Matthias Soellner, and Jan Marco Leimeister. 2021.

ArgueTutor: An Adaptive Dialog-Based Learning System for Argumentation Skills. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama, Japan) (CHI ’21) . Association for Computing Machinery, New York, NY, USA, Article 683, 13 pages.

Wambsganss et al. (2020)

Thiemo Wambsganss, Christina Niklaus, Matthias Cetto, Matthias Söllner, Siegfried Handschuh, and Jan Marco Leimeister. 2020.

AL: An Adaptive Learning Support System for Argumentation Skills. In Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’20) . Association for Computing Machinery, New York, NY, USA, 1–14.

Wambsganss et al. (2022)

Thiemo Wambsganss, Matthias Soellner, Kenneth R Koedinger, and Jan Marco Leimeister. 2022.

Adaptive Empathy Learning Support in Peer Review Scenarios. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . Association for Computing Machinery, New York, NY, USA, Article 227, 17 pages.

Wan et al. (2024)

Qian Wan, Siying Hu, Yu Zhang, Piaohong Wang, Bo Wen, and Zhicong Lu. 2024.

”It Felt Like Having a Second Mind”: Investigating Human-AI Co-creativity in Prewriting with Large Language Models.

Proc. ACM Hum.-Comput. Interact. 8, CSCW1, Article 84 (April 2024), 26 pages.

Wang et al. (2024)

Jiyao Wang, Haolong Hu, Zuyuan Wang, Song Yan, Youyu Sheng, and Dengbo He. 2024.

Evaluating Large Language Models on Academic Literature Understanding and Review: An Empirical Study among Early-stage Scholars. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI ’24) . Association for Computing Machinery, New York, NY, USA, Article 12, 18 pages.

Wang et al. (2022)

Yunlong Wang, Priyadarshini Venkatesh, and Brian Y Lim. 2022.

Interpretable Directed Diversity: Leveraging Model Explanations for Iterative Crowd Ideation. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI ’22) . Association for Computing Machinery, New York, NY, USA, Article 183, 28 pages.

Wasi et al. (2024)

Azmine Toushik Wasi, Taki Hasan Rafi, and Dong-Kyu Chae. 2024.

DiaFrame: A Framework for Understanding Bengali Dialects in Human-AI Collaborative Creative Writing Spaces. In Companion Publication of the 2024 Conference on Computer-Supported Cooperative Work and Social Computing (San Jose, Costa Rica) (CSCW Companion ’24) . Association for Computing Machinery, New York, NY, USA, 268–274.

Wu et al. (2019)

Shaomei Wu, Lindsay Reynolds, Xian Li, and Francisco Guzmán. 2019.

Design and Evaluation of a Social Media Writing Support Tool for People with Dyslexia. In Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (Glasgow, Scotland Uk) (CHI ’19) . Association for Computing Machinery, New York, NY, USA, 1–14.

Wu et al. (2024)

Yiying Wu, Yunye Yu, and Pengcheng An. 2024.

Dancing with the Unexpected and Beyond: The Use of AI Assistance in Design Fiction Creation. In Proceedings of the Tenth International Symposium of Chinese CHI (Guangzhou, China and Online, China) (Chinese CHI ’22) . Association for Computing Machinery, New York, NY, USA, 129–140.

Xu et al. (2024)

Xiaotong (Tone) Xu, Jiayu Yin, Catherine Gu, Jenny Mar, Sydney Zhang, Jane L. E, and Steven P. Dow. 2024.

Jamplate: Exploring LLM-Enhanced Templates for Idea Reflection. In Proceedings of the 29th International Conference on Intelligent User Interfaces (Greenville, SC, USA) (IUI ’24) . Association for Computing Machinery, New York, NY, USA, 907–921.

Yanardag et al. (2021)

Pinar Yanardag, Manuel Cebrian, and Iyad Rahwan. 2021.

Shelley: A Crowd-sourced Collaborative Horror Writer. In Proceedings of the 13th Conference on Creativity and Cognition (Virtual Event, Italy) (C&C ’21) . Association for Computing Machinery, New York, NY, USA, Article 11, 8 pages.

Yuan et al. (2022)

Ann Yuan, Andy Coenen, Emily Reif, and Daphne Ippolito. 2022.

Wordcraft: Story Writing With Large Language Models. In Proceedings of the 27th International Conference on Intelligent User Interfaces (Helsinki, Finland) (IUI ’22) . Association for Computing Machinery, New York, NY, USA, 841–852.

Zhang et al. (2023a)

Mingyuan Zhang, Zhaolin Cheng, Sheung Ting Ramona Shiu, Jiacheng Liang, Cong Fang, Zhengtao Ma, Le Fang, and Stephen Jia Wang. 2023a.

Towards Human-Centred AI-Co-Creation: A Three-Level Framework for Effective Collaboration between Human and AI. In Companion Publication of the 2023 Conference on Computer Supported Cooperative Work and Social Computing (Minneapolis, MN, USA) (CSCW ’23 Companion) . Association for Computing Machinery, New York, NY, USA, 312–316.

Zhang et al. (2023b)

Zheng Zhang, Jie Gao, Ranjodh Singh Dhaliwal, and Toby Jia-Jun Li. 2023b.

VISAR: A Human-AI Argumentative Writing Assistant with Visual Programming and Rapid Draft Prototyping. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST ’23) . Association for Computing Machinery, New York, NY, USA, Article 5, 30 pages.
