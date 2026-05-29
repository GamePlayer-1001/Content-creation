---
title: "Rich-Get-Richer? Analyzing Content Creator Earnings Across Online Platforms"
source: "arXiv"
url: "https://arxiv.org/html/2509.26523v1"
author: "Ilan Strauss et al. (arXiv)"
type: "academic_preprint"
language: "en"
template_kind: "academic_reference"
license_note: "Open full-text web source; saved locally for style-analysis reference."
---
# Rich-Get-Richer? Analyzing Content Creator Earnings Across Online Platforms

> Source: https://arxiv.org/html/2509.26523v1

\newdateformat

mydate \monthname [ \THEMONTH ] \THEYEAR

# “Rich-Get-Richer”? Analyzing Content Creator Earnings Across Large Social Media Platforms

Ilan Strauss

Jangho Yang

and Mariana Mazzucato

Equal contributors (Ilan Strauss and Jangho Yang). Ilan Strauss is Co-Director at the AI Disclosures Project (Social Science Research Council), and a Senior Fellow at the Institute for Innovation and Public Purpose (IIPP), University College London (UCL), London, UK, WC1E 6BT. Jangho Yang is Assistant Professor of Management Sciences in the Faculty of Engineering, University of Waterloo. Mariana Mazzucato is Professor in the Economics of Innovation and Public Value at University College London, and founding director of Institute for Innovation and Public Purpose (UCL). All errors are our own. Contacts: ilan@aidisclosures.org (Corresponding Author) and j634yang@uwaterloo .

( \mydate September 30, 2025

This paper examines whether monthly content creator earnings follow a power law distribution, driven by compounding ‘rich-get-richer’ dynamics [ 6 ] . Patreon creator earnings data for 2018, 2021, and 2024 for Instagram, Twitch, YouTube, Twitter, Facebook, and Patreon exhibit a power law exponent around α = 2 \alpha=2 . This suggests that algorithmic systems generate unequalizing returns closer to highly concentrated capital income and wealth, rather than labor income. Platforms governed by powerful and compounding recommendation systems, such as Instagram and YouTube, exhibit both a stronger power law relation (lower α \alpha ) and lower mean, median, and interquartile earnings, indicating algorithms that disproportionately favor top earners at the expense of a ‘middle class’ of creators. In contrast, Twitter and Patreon have a more moderate α \alpha , with less earnings inequality and higher middle class earnings. Policies which incentivize the algorithmic promotion of longer-tail content (to explore more and exploit less) may help creator ecosystems become more equitable and sustainable.

JEL Codes : D31, L86, D85, D91, O33.

Keywords : Digital Platforms, power law Distributions, Algorithmic Fairness, Income Inequality, Recommendation Systems.

## 1  Introduction

Despite their significance, digital labor markets and their associated earnings distributions remain largely opaque and unregulated [ 49 , 33 ] . This paper aims to fill this gap by examining how algorithms shape earnings distributions in digital platforms and the welfare implications of these patterns. The declining quality of platforms’ algorithmic allocations has been an important reflection of their increasing market power [ 59 , 50 , 19 ] . But the relationship between earnings allocations within platforms – driven by algorithmic allocations of user attention – and market structure is not straightforward (Section 4 ).

One useful way to understand and characterize earnings online is the power law distribution, P ​ ( X > x ) ∼ 1 x α P(X>x)\sim\frac{1}{x^{\alpha}} , which can provide insights into the scaling of the system, the extent of earnings inequality, and the possible mechanisms behind it. Power laws describe distributions where small occurrences are extremely common, while large occurrences are extremely rare but have a significant impact. A lower power law exponent generally implies a higher degree of inequality, since it means a greater probability of finding very high (extreme) tail incomes, characteristic of long-tail distributions such as wealth [ 51 , 3 ] . Long-tail distributions famously occur online too, such as with internet traffic, where a few websites get the majority of visits [ 1 , 37 ] .

Several factors have been found to reinforce the unequal dynamics which network effects create online, chief among them algorithmic selection and recommendation of content, which frequently amplifies pre-existing popularity [ 66 , 36 ] , creating a ‘winner takes all’ or viral effect [ 57 , 56 ] . This compounding of initial advantage, also called a ‘superstar effect’ in economics [ 28 , 4 ] , can be characterized more generally by a ‘preferential attachment’ model [ 6 ] . The hypothesis we estimate is that the same ‘rich-get-richer’ dynamics that drive attention in the preferential attachment model [ 6 ] also govern content creator earnings. As creators gain visibility, they attract further algorithmic attention, leading to a large concentration of income among a small group of highly popular creators. Earnings data, therefore, provide a concrete and measurable outcome of these dynamics. A similar dynamic of persistence has been shown to govern firm dynamics in the economy

[ 31 , 30 , 10 ] , however, online, network and algorithmic effects can supercharge this [ 21 ] . 1 1 endnote: 1 The low marginal cost to distributing and selling content online adds to the power law, which arises from the feedback introduced by correlated decisions across a population [ 21 ] .

The key questions we investigate are whether the distribution of Patreon content creator earnings across major social media platforms follows a power law pattern, and how the estimated power law exponent ( α \alpha ) reflects the health and equity of the platform ecosystem.

We answer this question by exploiting a novel feature in a large dataset (n = 104,719) of Patreon monthly earnings data for the years 2018, 2021, and 2024, which allows us to identify creators who use only a single social media site (or none). Patreon is a monetization platform for content creators, allowing them to sell additional or primary content to subscribers (paid and unpaid). Earnings here are a direct reflection of popularity, as monetization mechanisms – such as ad revenue sharing, sponsorships, and promotions – are closely linked to a creator’s reach and influence.

We find that the monthly earnings distribution of Patreon content creators across platforms fits a power law distribution with an exponent around α = 2.0 \alpha=2.0 (lower exponent is more concentrated), highlighting an influential tail of a few high earning content creators. A powerful ‘rich-get-richer’ dynamic, represented by a preferential attachment model [ 6 ] , is an excellent fit for explaining how this power law arises (as the limiting distribution) on YouTube ( α = 1.8 \alpha=1.8 ), Instagram ( α = 1.84 \alpha=1.84 ), Twitch ( α = 1.93 \alpha=1.93 ), and Facebook ( α = 1.94 \alpha=1.94 ). 2 2 endnote: 2 For α < 2 \alpha<2 the mean of the distribution converges, which means the average earnings across creators is finite. However, the variance diverges, indicating that earnings can vary wildly, with no typical range for large creators. Practically, this means that the mechanism(s) generating content creator earnings online [ 59 ] is closer to the multiplicative and compounding effects of capital and wealth ( α = 1.5 \alpha=1.5 typically) [ 28 , 42 ] . 3 3 endnote: 3 For debate see: [ 12 ] .

Secondly, we find that the ‘rich-get-richer’ dynamic, characteristic of platforms with stronger power laws (lower α \alpha ), may harm the platform’s ‘middle class’ of content creators, as they also land up experiencing lower mean and median earnings, with a less expansive interquartile earnings range (Q25-Q75). In contrast, platforms with weaker power law relations – namely Patreon and especially Twitter – exhibit a somewhat healthier ecosystem that does support a middle-class of creator earnings. This may be driven by the potentially compounding nature and centralized integration of algorithmic content recommendation systems on platforms such as Instagram and YouTube [ 18 , 17 ] , which may not sufficiently promote lesser-known creators [ 2 ] . Patreon’s more moderate α \alpha value may be due to its direct creator-audience relationships. Twitter’s weaker power law reflects more opportunities for content creators, especially ‘NSFW’ (‘not safe for work’) creators earning below 2 , 114 2,114 a month. But for those earning above this, Twitter’s earning opportunities are in fact more concentrated that on other platforms.

Thirdly, we find a growing convergence (and worsening) over time in YouTube, Twitch, Instagram, and Facebook power laws, perhaps as algorithmic influence grows (relative to social graph mechanisms), α \alpha values decline, implying growing concentration in earnings among a few. Instagram shows the most extreme change, with α \alpha worsening from around 2.1 in 2021 or above to around 1.84 in 2024. Patreon content creators on Twitter appear not to have suffered from Elon Musk’s takeover of the platform in October 2022, with their earnings distribution becoming less unequal (higher α \alpha ) relative to 2021. The main impact in the data is that far more NSFW content creators left Instagram and joined Twitter since 2021. But, overall, there are no countervailing forces to offset pure ‘rich-get-richer’ (preferential attachment) dynamics on platforms. Potential corrective measures (Section 4 ), such as mandated use and disclosure of recommendation systems by platforms that better incentivize the creation and reward of longer-tail content [ 52 , 35 , 65 ] , may be the most effective means of fostering a more equitable ecosystem of content creators online. And to the extent that more unequal earnings distributions reflects platform market power, rather than more inter-platform competition, antitrust policy has a role to play too (Section 4 ).

Notably, unlike income distribution models where the power law typically governs only the extreme right tail, with the majority of the distribution better explained by exponential or gamma-type distributions [ 61 ] , our results indicate that social media earnings data as a whole are largely dominated by a power law, as evidenced by the small estimated minimum dollar values at which power law dynamics emerge. Despite a few previous studies employing Patreon earning data [ 55 , 24 , 38 ] , we provide the first systematic analysis of the nature of the distribution – and in turn the likely economic process or algorithmic mechanisms generating this data. Moreover, we provide some of the only evidence on the distribution of earnings of content creators [ 40 , 53 ] .

A key limitation is the use of Patreon content creators earnings as a proxy for the health of platform content creators as a whole, given that the underlying monetization mechanisms do differ somewhat. This means that we cannot rule Patreon specific drivers for our findings (such as users having to click through to the Patreon creator’s site) or a selection bias at play. However, the weaker power law dynamic operating on Patreon creators active on Twitter, and those without alternative active social media platforms (content creators reliant only on Patreon), greatly reduces the veracity of this argument. In the following Section 2 we lay out our data and power law method, along with the underlying ‘rich-get-richer’ dynamic underpinning it – discussed further in Appendices. This is followed by our results (Section 3 ) and a concluding section with a brief discussion on market power and recommender system types, including how to incentivize greater incorporation of non-viral (longer-tail) content [ 2 ] in recommender systems (Section 4 ).

## 2  Data and Method

This section motivates our use of a power law to estimate earnings, and our interpretation of it as reflecting a ‘rich-get-richer’ dynamic, drawing on the preferential attachment model outlined in [ 6 ] (‘BA’ model). This ‘BA’ model predicts a power law distribution of attention with an exponent α = 2 \alpha=2 in cases of pure preferential attachment. Before discussing the model we detail our data.

### 2.1  Data and Descriptive Statistics

We use official Patreon monthly earnings data for content creators purchased directly from the Patreon platform, for the month of March for years 2018, 2021, and 2024. Significant earnings data is missing, especially for larger earners (since those with more paid subscribers tend to disclose their earnings the least). Not imputing missing earnings, therefore, would introduce significant downward bias on the right tail of the distribution. We impute missing earnings linearly using a basic specification, based on earnings being a function of paid members (subscribers), all members, the type of content created, if they are an NSFW content creator, and the year of the data. This is unlikely to the sole type of earnings for these content creators, since they can also make money directly from their affiliation with the social media platform, e.g. from YouTube ads and marketing, unless their only affiliation is Patreon. We restrict the dataset to include only content creators with monthly earnings exceeding $10 USD.

We segment the data by the social media platform(s) the Patreon content creators use to engage their audiences. We identify creators who only use a single social media platform and remove from our dataset all earners with more than one social media affiliation. The dataset spans Patreon creators across major platforms, including YouTube, Instagram, Twitter, Twitch, Facebook, and Patreon only. Table  1 provides summary statistics for earnings by platform, detailing the number of observations, mean earnings, standard deviation (SD), and key percentiles (minimum, 25th, 50th, 75th, and maximum).

Table 1: Summary statistics of Patreon monthly earnings by social media platform (US$, except Obs).

Platform |

Obs |

Mean |

Median |

SD |

Min |

Q25 |

Q50 |

Q75 |

Max |

Facebook |

8,458 |

149 |

47 |

631 |

10.00 |

29.6 |

46.5 |

99.0 |

35,261 |

Instagram |

35,879 |

226 |

59 |

1,076 |

10.00 |

33.3 |

59.3 |

142.0 |

60,391 |

Patreon |

83,950 |

278 |

57 |

1,667 |

10.00 |

30.7 |

56.6 |

154.1 |

211,321 |

Twitch |

1,793 |

198 |

46 |

1,174 |

10.04 |

28.8 |

46.0 |

104.6 |

31,436 |

Twitter |

47,564 |

373 |

72 |

2,159 |

10.00 |

33.5 |

71.9 |

214.8 |

169,106 |

Youtube |

23,435 |

250 |

47 |

1,490 |

10.00 |

28.4 |

46.7 |

118.7 |

87,802 |

Note : The table includes the number of observations (Obs), mean earnings, standard deviation (SD), and percentiles (Min, Q25, Q50, Q75, Max) for creators on each platform in monthly US$.

The data highlights significant variation in earnings across platforms, reflecting differences in audience engagement, platform monetization dynamics, and creator ecosystems. Twitter has the highest mean, median, and interquartile earnings, along with Patreon, while Facebook and Twitch have the lowest mean, median, and interquartile earnings respectively. We note later that this proxy for ecosystem health or strength (median, mean, and interquartile earnings), correlates strongly with the estimated power law for each platform. The standard deviation of earnings is highest for Twitter and lowest for Facebook. Facebook is the only platform to have fewer exclusive Patreon content creators in our data in 2024 than it had in 2021 (Table 2 in Appendix).

### 2.2  Power Law Model

Much evidence shows that many aspects of society and the economy follow power law distributions [ 28 ] , in which the vast majority of outcomes are small, yet a few are extraordinarily large and command a substantial share of the total. Online markets reflect similar patterns, often exhibiting extreme disparities in earnings. For example, a small number of top content creators or successful e-commerce sellers may capture a disproportionate share of total revenue [ 27 , 16 ] .

A power law perspective offers a general framework for understanding the “rich-get-richer” dynamics common in digital platforms [ 21 , 9 ] . As an entity – be it a creator or a seller – gains initial visibility, algorithms frequently amplify this advantage, leading to further growth in both attention and earnings [ 66 , 36 ] . This process, known as preferential attachment [ 6 ] , creates a self-reinforcing feedback loop: as certain participants accumulate more engagement, they become even more likely to attract future interactions, thereby concentrating earnings at the top. By examining earnings distributions and identifying whether they adhere to a power law, researchers can better understand the underlying reinforcement mechanisms and the extent to which disparities are entrenched. 4 4 endnote: 4 Some econophysics models distinguish a two-class structure in income distributions, where the working class income follows an exponential distribution (reflecting additive processes) and the rentier or capitalist class income follows a power law (reflecting multiplicative processes). See [ 43 , 20 ] .

Detecting a power law distribution in earnings data can, therefore, provide valuable insights into the health and fairness of online ecosystems. Highly skewed distributions, with a large “underclass” earning very little, may signal systemic challenges such as algorithmic bias, barriers to entry, or a lack of upward mobility for newcomers [ 23 , 47 ] . Conversely, distributions less dominated by a small set of top earners suggest a more inclusive and competitive environment, offering broader opportunities for participants to succeed. Understanding these patterns can inform platform governance, guide policymakers, and help researchers propose fairer algorithms and revenue-sharing mechanisms, ultimately leading to more equitable digital economies [ 22 , 33 ] .

### 2.3  Power Laws and Algorithmically-Driven ‘Rich-Get-Richer’ Dynamics

A power law can be written as:

P ​ ( A ) ∝ A − α , P(A)\propto A^{-\alpha}, |

(1) |

where P ​ ( A ) P(A) is the probability of observing a node (e.g., a content creator) with attention A A (such as clicks, views, or follows) greater than or equal to a certain threshold (the cumulative distribution function, CDF), and the exponent α \alpha characterizes the degree of inequality in how attention is distributed across the network.

Power law distributions appear in many domains [ 28 ] , often driven by underlying self-reinforcing processes. One such process is captured by the model introduced by [ 6 ] , which effectively illustrates how compounding algorithmic advantage can emerge in social and digital networks. In online platforms, a small number of creators can accumulate disproportionate attention over time, aided by algorithms that recommend popular or trending content more aggressively.

The foundational mechanism is akin to a reinforced Pólya urn model, adapted here to the digital attention landscape. As a network of creators and consumers grows, new attention events – new views, clicks, or follows – do not occur uniformly at random. Instead, they tend to cluster around creators who already have substantial visibility. This reinforces the popularity of a few, resulting in a ‘rich-get-richer’ dynamic commonly observed on platforms governed by algorithmic curation and recommendation [ 5 , 41 , 28 , 63 , 21 , 7 , 8 ] .

To model this, we introduce a parameter γ \gamma that balances between random attention allocation (exploration) and attention guided by existing popularity (exploitation):

With probability γ \gamma , an attention event (e.g., a new user’s click, view, or follow) is directed to a creator chosen uniformly at random, independent of current popularity.

With probability 1 − γ 1-\gamma , the likelihood of directing attention to a particular creator is proportional to that creator’s existing level of attention.

This parameter γ \gamma represents how the platform’s algorithm navigates between exploration (showing less-known creators, broadening the range of content surfaced) and exploitation (showing widely-popular creators, reinforcing established winners). A low γ \gamma implies strong preferential attachment to already-popular creators, amplifying their advantage, whereas a high γ \gamma distributes attention more evenly and blunts the rich-get-richer effect.

Originally, the Barabasi-Albert (BA) model assumed full preferential attachment (equivalent to γ = 0 \gamma=0 ) [ 6 ] , leading directly to a power law exponent α = 2 \alpha=2 . 5 5 endnote: 5 See Appendix  B.2 for the original derivation. Here, we generalize that approach to show how α \alpha depends on the exploration parameter γ \gamma .

By extending the BA model and following a heuristic derivation, 6 6 endnote: 6 See Appendix  B for details. we find:

α = 1 + 1 1 − γ . \alpha=1+\frac{1}{1-\gamma}. |

(2) |

In this formulation, reducing γ \gamma (i.e., relying more on popularity-driven exploitation) decreases α \alpha , intensifying inequality and concentrating attention among top creators. Conversely, increasing γ \gamma promotes exploration, raising α \alpha and yielding a more balanced distribution of attention.

### 2.4  Interpretation of α \alpha

The exponent α \alpha provides insights into the structure of algorithmically mediated attention ecosystems. Since α \alpha is directly shaped by γ \gamma , it reflects how the platform’s algorithmic preferences influence the overall distribution of attention:

A smaller α \alpha (closer to 2) indicates that the algorithm heavily favors already-popular creators (lower γ \gamma ), leading to a steeply skewed distribution of attention.

A larger α \alpha corresponds to a more equitable distribution of attention, arising from a higher γ \gamma , i.e., an algorithm that is more “exploratory” and less biased toward existing popularity.

This approach mirrors the logic of a Pólya urn with reinforcement [ 14 , 15 ] , where the probability of adding a ball of a certain color increases with the number already in the urn. In the digital realm, each new click or view (analogous to adding a ball) is more likely to go to a popular creator (a “color” that already has many balls). Adjusting γ \gamma changes the algorithm’s propensity to reinforce existing popularity.

Applied to platform earnings, the same attention-reinforcing mechanisms shape creators’ revenue streams. If visibility and engagement are governed by these dynamics, then earnings—derived from ads, sponsorships, or subscriptions—also become concentrated among a few popular creators. By estimating α \alpha from observed earnings distributions, we can quantify how deeply entrenched the rich-get-richer effect is in these digital ecosystems and assess whether algorithmic changes (modifying γ \gamma ) can create more sustainable conditions for a broader “middle class” of creators.

## 3  Results

To fit the power law tail, we apply the method introduced by [ 16 ] , which relies on maximum likelihood estimation to fit the power law model and employs the Kolmogorov-Smirnov (KS) statistic to assess the goodness-of-fit. This approach estimates the scaling parameter by maximizing the likelihood of the observed data and determines the lower bound for power law behavior by minimizing the distance between the empirical and theoretical distributions. The analysis is conducted using the poweRlaw package [ 32 ] in R [ 54 ] .

Figure 1: Log-log complementary cumulative distribution function (CCDF) of earnings data for each platform with fitted power law lines.

Note : The red vertical dotted line indicates the estimated minimum value at which the distribution follows a power law pattern. Estimations were performed for each platform and year, and results remained robust across resampled datasets.

Figure  1 displays the log-log complementary cumulative distribution function (CCDF) of earnings data across the major social media platforms YouTube, Instagram, Twitch, Patreon, Twitter, and Facebook, along with the ideal power law lines for each in red (sloping downwards). The red vertical dotted line represents the estimated minimum value above which the earnings distribution adheres to a power law pattern. Several key findings emerge. 7 7 endnote: 7 See Appendix  A for a discussion on the robustness of the results.

The earnings distributions for most platforms in Figure  1 exhibit a strong power law pattern around α = 2 \alpha=2 . 8 8 endnote: 8 A power law exponent of 2 means that as you move to higher earnings, the probability of observing such high earners decreases as the square of their earnings, formally P ​ ( X > x ) ∼ 1 x α = 1 x 2 P(X>x)\sim\frac{1}{x^{\alpha}}=\frac{1}{x^{2}} . For example, if 1,000 creators earn $100, only about 100 will earn $1,000, and only 10 will earn $1,000,000. This follows from the scale invariance properties of the power law coupled with our finding that the power law begins very early on in the earnings distribution. This means that the benefits to moving up the algorithmic ‘ladder’ are likely enormous at each rung, highlighting just how important it is to be higher up the screen, or the user’s attention sphere. Position matters enormously to monetization. YouTube, Instagram, Twitch, and Facebook consistently show well-defined power law distributions, ranging between 1.8 and 1,94 for the year 2023, suggesting significant earnings concentration among top creators. Patreon and Twitter show a much weaker power law (2.24 and 2.35, respectively).

Power law dynamics emerge early at between $26 and $70 per monthly earnings across these platforms, a very low monthly earnings amount consistent across platforms. At an annual amount of $312 to $840 this is in stark contrast to standard income distributions, where the power law typically applies to income levels only above $100,000 per annum [ 20 , 61 ] .

Unlike income distribution models where the power law typically governs only the extreme right tail [ 61 ] , 9 9 endnote: 9 With the majority of the distribution better explained by exponential or gamma-type distributions. our results show that social media earnings data are largely dominated by a power law from very early on in the earning distribution. It is worth noting though that the extreme right tail is not as concentrated as a pure power law for most platforms, represented by the grey data points in Figure  1 falling off below the slanted red power law lines. Twitter, however, shows a strong power law on its right-most tail, implying that earnings become extremely concentrated but only once a higher threshold is reached ($2,114). This means that opportunities for Patreon content creators on Twitter are likely to be greater than other comparable platforms below this threshold (especially for ‘NSFW’ creators). Figure  2 plots the average α \alpha by platform (left hand side) and year (right hand side).

Figure 2: Average α \alpha by platform (pooled years) and α \alpha time series for each platform.

Platform-specific power law exponents ( α \alpha ) exist and reflect differences in earnings inequality and platform dynamics. YouTube and Twich have the lowest, i.e. most extreme, estimated α \alpha values, suggesting relatively heavier tails and higher inequality, indicating a greater tendency for the emergence of super-hubs—nodes with degrees larger than expected in the standard preferential attachment model [ 6 ] . Twitter and Patreon consistently display the highest (least extreme) α \alpha values, reflecting lighter tails and less earnings inequality.

Furthermore, temporal trends in α \alpha show a worsening in the platform power-relation, perhaps as algorithmic power grows. Across Facebook, Instagram, Twitch, and Youtube, α \alpha values have generally worsened over time (getting smaller), reflecting a transition toward heavier tails and higher earnings inequality at the extremes, as a pure Pólya urn effect emerges in line with the preferential attachment model [ 6 ] . Youtube has the lowest value in 2023, followed closely by Instagram, with values around 1.8 and 1.88. Instagram shows the most extreme change in α \alpha values over time, and in particular between 2021 and 2023, which may reflect the large changes made to its platform to promote less social graph and more purely algorithmic content in users’ feeds. Lastly, it is worth noting that Patreon content creators on Twitter appear not to have suffered from Elon Musk’s takeover of the platform in October 2022, with their earnings distribution becoming less unequal (higher α \alpha ) since 2021. Though ‘NSFW’ (not safe for work) creators increased on the platform by almost 30 percentage points, going from 45% and 46% of Patreon creators on Twitter in 2018 and 2021, respectively, to 58% in 2014, reflecting a growing permissiveness on the platform and Instagram cracking down (Table 2 in Appendix).

Figure 3: Median vs. α \alpha across platforms.

Figure  3 shows a clear association between the power law exponent ( α \alpha ) and the median of the earnings distribution: platforms with higher median earnings tend to exhibit less heavy-tailed distributions (higher α \alpha ). This indicates that high earnings for the middle layer of creators (“middle-class”) are associated with less unequal platforms. Twitter – and to some extent Patreon – stands out in this context, combining a high median income with a relatively equal earnings distribution up until a certain point. This suggests a more robust middle-class of creators, even though Twitter’s dominance of top earners is in fact worse than other platforms. In contrast, platforms with lower α \alpha show a “rich-get-richer” pattern far earlier one, where a small elite captures most of the income, leaving the middle-class of creators under-rewarded.

Figure  4 notes the proportion of observations for each platform (pooled across years) which follow a power law distribution. This allows us to assess the extent to which the power law distribution characterizes content creators’ earnings. It shows that the proportion of earnings following a power law distribution varies significantly across platforms, from 5% (Twitter) to almost 55% (Twitch). Twitch and YouTube demonstrate the highest power law proportions (0.55 and  0.47, respectively), suggesting that a large share of creator earnings is dominated by the power law distribution. This may reflect the platforms’ strong algorithmic recommendation systems and high reliance on ‘viral’ or popular content. Instagram and Facebook also show a relatively high and similar proportion (0.40-0.43). Patreon and Twitter show moderate to lower power law proportions, suggesting that only the very top of the income distribution aligns with the power law, as is often observed in standard income distributions [ 20 , 61 ] .

Figure 4: Proportion of the earnings distribution following a power law pattern for each platform calculated on the pooled years.

Lastly, Figure  5 illustrates the power law dynamics by Patreon defined category for each content creator, pooling across all social media platforms, including Patreon. Animation followed by Podcasts exhibit the lowest, i.e. most extreme, α \alpha values, indicating more pronounced earnings inequality compared to other categories. This may reflect how this content is disseminated and made viral, with a more extreme ‘winner-takes all’ dynamic at play, possibly due to limited opportunities for audience discovery, the dominance of established creators, and its highly competitive consumption & monetization structure. The Music, comics, and writing categories all show relatively high α \alpha , suggesting more equitable earnings distributions. It may be harder to differentiate oneself in these categories as a content creator on Patreon, and may reflect a selection bias, with mid-tier content creators choosing to join Patreon in these categories but not the highest earners. These categories may be more adept at providing some opportunities for mid-tier creators.

Figure 5: Average α \alpha by categories.

Note : The simple average represents the unweighted average across all categories for each year, while the weighted average is calculated based on the number of observations in each category.

## 4  Discussion: Market Structure, Algorithms, & Policies

### 4.1  Restatement of core findings

By detailing the power law dynamics governing digital creator economies, this paper contributes to broader discussions on fairness, sustainability, and innovation in networks [ 9 ] . Our findings highlight the central role of algorithmic design in shaping earnings inequality and emphasize the need for interventions that work to moderate algorithmic effects, balancing fairness with platform engagement objectives. A key limitation is the use of Patreon content creators as a proxy for the health of platform content creators themselves, given that the underlying monetization mechanisms do differ somewhat.

Our analysis confirms that earnings distributions on most of the major social media platforms closely follow power law dynamics, with an average power law exponent ( α \alpha ) value around 2.0. One implication of this is that, as per the preferential attachment model of [ 6 ] , initial advantage online generates further ones. Patreon content creator earnings across major social media platforms are driven by compounding mechanisms resembling capital income rather than labor-based dynamics.

Importantly, platforms with stronger recommendation systems, such as YouTube ( α = 1.8 \alpha=1.8 ) and Instagram ( α = 1.84 \alpha=1.84 ), exhibit even more significant earnings inequality, and a weaker ‘middle-class’ of creators (with lower mean, median, and interquartile earnings), reflecting the amplification of this “rich-get-richer” dynamics. By contrast, Twitter, and to a lesser extent Patreon – with its direct creator-audience funding model – has a more equitable earnings distribution up until a certain point, with higher α \alpha values reflecting lower total earnings concentration, and a larger ‘middle-class’ of creator earnings (higher mean, median, and interquartile earnings and the power law kicking-in much later in the earnings distribution).

Temporal trends show worsening (and converging) earnings power law earnings dynamics of Patreon creators on Instagram, YouTube, Facebook, and Twitch, where decreasing α \alpha values suggest growing dominance of top Patreon creators. Instagram’s α \alpha dropped from around 2.1 in 2018 to around 1.84 in 2023, coinciding with accelerated algorithmically-driven content prioritization. These trends may indicate that algorithmic systems increasingly favor viral content over diverse creator engagement, potentially undermining long-term ecosystem health. Twitter’s power law relation weakened during the period of Musk’s takeover (2021 vs. 2024), indicating no harm to independent Patreon creators as a whole on Twitter - with NSFW creators flocking to the platform (and leaving Instagram).

Platforms with lower α \alpha values, such as YouTube and Instagram, face significant risks, including discouraging mid-tier creators and amplifying the spread of viral or harmful content. Conversely, platforms like Patreon and Twitter, with higher α \alpha values, may be able to foster healthier ecosystems, supporting broader creator participation.

### 4.2  Market power and earnings inequality

What is less clear is the relationship between the earnings distribution, seen within the platforms we have examined, and how competitive the social media market is – also known as the underlying ‘market structure’ (defined as the number of firms in the market, driven by cost structure and ultimately technology) [ 13 ] .

If Patreon and Twitter compete less with the other social media platforms, then this may be evidence of the relationship between a less concentrated market structure and more equal algorithmic distribution of content creator earning - since Patreon only& Twitter only (Patreon content creator) earnings on these platforms is more equal. Platforms that are more dominant in the social media market may tend towards less equal distributions (YouTube vs. Instagram). But it is not necessarily obvious why promoting viral algorithmic content is necessarily more profitable to the platform.

More competition in the social media market has had ambiguous effects, theoretically, on the content creator earnings distribution.

Greater competition in the social media platforms market from TikTok occurred through it promoting more longer-tail content – but this was purely algorithmically selected content (unrelated to the user’s social graph) [ 11 ] . This shifted competition directly to the algorithm, which over time seems to have promoted more addictive content, and perhaps in turn more viral content (thereby fostering a ‘winner takes all’ dynamic). The counter, egalitarian-enhancing tendency, from more competition in the market, has been that platforms have increased pay to content creators to attract them away from TikTok [ 25 ] . But this could just as much increase within platform inequality if top-tier content creators are the focus of such competitive poaching.

Ultimately, the most likely explanation may reflect technological factors more than market structure. More inequality among content creators on – and even between – platforms may simply reflect platforms ads-sharing model with content creators. By paying content creators a percentage of ads share, they are receiving a share of ads sales, that grows exponentially with sales (algorithmic attention). They are effectively sharing in algorithmic allocations directly. It is notable that YouTube offers the most generous share of ad sales and it hosts the greatest earnings inequality among Patreon earners [ 26 ] . 10 10 endnote: 10 Though its unclear if this mechanism would be reflected in our dataset, since Patreon content creators monetize through clicks through to Patreon. Applied to our specific dataset, the argument similarly becomes that Patreon content creators generate capital-like inequality of earnings within, and between, their primary platforms due to content creation and distribution being an ultra-low marginal cost endeavour, thereby favoring economies of scale (and favoring network effects).

### 4.3  Policies to unlock more non-viral (longer-tail) content in algorithmic systems

A central challenge facing recommender systems on mature platforms is their potential to compound initial advantage (viewership), by exploiting popular, existing material and focusing less on untested ‘fresh’ content [ 17 , 60 ] . To the extent that this becomes caked into a platform’s business model, with associated commercial incentives, it can become difficult to dislodge this approach through market forces alone.

A “longer-tail” algorithmic system [ 2 ] , whereby a more diverse range of content is explored and promoted, invariably trades off some (more) immediate profit (exploitation of existing content), in favor of greater content exploration [ 35 , 65 ] . But maximizing for immediate user engagement [ 39 ] , as a quarterly economic imperative facing the platform’s shareholders, can lead to less new content being created and even less longer-term user engagement – even if potentially at the expense of diminished immediate user satisfaction [ 45 , 65 ] . Several potential reforms are possible to grow healthier – more diverse and equitable – ecosystems of content promotion and consumption:

Firstly, we recommend measures that incentivize long-term orientated (algorithmic) A/B testing, to help highlight the business case for longer-term business optimizations at the algorithmic level [ 44 ] . [ 35 ] recommends modifying the learning rates of recommendation algorithms to help balance the trade-off between exploration and exploitation, ensuring that high-quality content is recognized and then promoted quickly. Recent research suggests that incorporating mechanisms to surface underrepresented (“longer-tail”) content [ 2 ] could enhance overall platform performance without necessarily sacrificing user satisfaction [ 34 , 65 ] . Use of longer-tail discovery algorithms on social media to unlock and match a greater variety of non-viral content to users might also be incentivized through mandatory platform mechanisms that penalize the creation of low-quality content from dominant creators [ 35 ] . Facebook has recently chosen to do the opposite [ 62 ]

Our second recommendation is for greater platform disclosure of the drivers of their recommendation systems, in-line with the Digital Services Act (DSA, Article 27) of the European Union – and in particular as a means to incentivize greater use of long-tail recommender systems [ 52 ] . Platforms should be required to disclose key details about their recommendation algorithms to regulators, researchers, and the public. These disclosures should include the algorithmic weighting of past engagement metrics, such as views and likes, which often amplify the visibility of previously successful content. In addition, platforms should clarify the criteria by which new or less popular content is surfaced within the recommendation engine, ensuring greater accountability for algorithmic bias. In addition, mechanisms in place that punish low quality, click-bait content, should be ideally detailed . In the DSA mandates platform audits, the extent to which AI and ML recommendation systems favor certain types of creators, content genres, or user demographics should be evaluated .

Finally, platforms could allow users to customize their feeds, such as through “content diversity sliders” to adjust the balance between popular and niche content. YouTube, for example, sometimes tries to encourage this by asking if you want to explore unrelated topics to what you have been watching. And although Article 27 of the DSA requires platforms to offer users such “non-profiling” alternatives (e.g. chronological feeds), this is seen as an alternative to algorithmically curated ones.

Lastly, reforms must take into account emerging AI technologies. AI technologies already impact the allocation of attention and in turn earnings within this platforms. AI drives more of the recommendations now seen online [ 29 ] , boosting monetization [ 58 ] . AI-generated content has the potential to foster more egalitarian ecosystems [ 67 ] , lowering barriers to entry. But more than this, as AI-generated content becomes more central to generating both organic and advertising content, attribution mechanisms to ensure copyright holders of the underlying content are rewarded will become important to fostering fairly remunerated ecosystems [ 48 ] . This also highlights the importance of connecting platform content creator ecosystems to seemingly external ones (underlying copyright holders or content creator owners).

##

Appendix A Robustness and Further Analysis

Table 2: Further statistics of Patreon monthly earnings by platform with NSF

Platform |

Year |

Num_Observations |

Mean_Earnings |

Median_Earnings |

Sum_Is_Nsfw |

Facebook |

2018 |

2,870 |

128 |

45 |

0.25 |

Facebook |

2021 |

3,068 |

170 |

52 |

0.18 |

Facebook |

2024 |

2,520 |

146 |

44 |

0.19 |

Instagram |

2018 |

414 |

185 |

60 |

0.46 |

Instagram |

2021 |

14,589 |

242 |

69 |

0.22 |

Instagram |

2024 |

20,876 |

216 |

53 |

0.27 |

Patreon |

2018 |

15,221 |

187 |

51 |

0.42 |

Patreon |

2021 |

30,768 |

287 |

63 |

0.36 |

Patreon |

2024 |

37,961 |

307 |

55 |

0.39 |

Twitch |

2018 |

54 |

136 |

41 |

0.43 |

Twitch |

2021 |

869 |

164 |

48 |

0.21 |

Twitch |

2024 |

870 |

236 |

42 |

0.21 |

Twitter |

2018 |

7,022 |

262 |

60 |

0.45 |

Twitter |

2021 |

16,576 |

382 |

77 |

0.46 |

Twitter |

2024 |

23,966 |

399 |

72 |

0.58 |

Youtube |

2018 |

2,143 |

199 |

44 |

0.17 |

Youtube |

2021 |

6,835 |

280 |

53 |

0.12 |

Youtube |

2024 |

14,457 |

243 |

43 |

0.12 |

Note : Summary statistics by year and platform, with NSFW percentage.

Figure 6: Comparison of tail exponents from different estimation methods

Note : This graph compares tail exponents estimated using the Hill estimator, the Clauset-Newman-Shalizi (CNS) method [ 16 ] , and the estimators described and implemented by [ 64 ] . For the latter, the adjusted Hill estimator (Adj alpha) and the moments estimation (Moments) are used. The CNS method, as introduced by [ 16 ] , relies on maximum likelihood estimation to fit the power-law model and uses the Kolmogorov-Smirnov (KS) statistic to assess goodness-of-fit. In contrast, [ 64 ] ’s implementation incorporates an automatic double bootstrapping procedure to determine the minimum value threshold.

Figure  6 compares tail exponents from three different estimation methods. With the exception of the earnings distribution for Patreon creators, the alpha values estimated by the three methods are generally consistent, confirming the robustness of the power-law pattern in the earnings distribution. For Patreon, discrepancies in the estimated exponents are particularly evident in the first two years (2018, 2021), where the tail decays more rapidly than the predicted line, as shown in Figure  1 . Similarly, for the last year of the Instagram data, the CNS estimator deviates from the other two methods, again reflected in the faster decay of the tail relative to the predicted line. In nearly all other cases, the exponents estimated by the three methods exhibit remarkable agreement.

##

Appendix B Preferential Attachment Model

### B.1  Derivation of the relationship between α \alpha and p

We provide a heuristic derivation of the power law. Based on [ 46 , 21 , 14 ] , the derivation of the power law begins with an approximation to make the model tractable. We switch from a probabilistic to a deterministic framework, where we model the growth of links to a node as a continuous function of time, x j ​ ( t ) x_{j}(t) , for node j j created at time t = j t=j .

The growth rate of x j ​ ( t ) x_{j}(t) is governed by the differential equation:

d ​ x j d ​ t = p t + ( 1 − p ) ​ x j t \frac{dx_{j}}{dt}=\frac{p}{t}+(1-p)\frac{x_{j}}{t} |

This equation reflects the combined effect of random linking (with probability p p ) and preferential attachment (with probability 1 − p 1-p ). Solving this differential equation yields:

x j ​ ( t ) = ( t j ) 1 − p − 1 x_{j}(t)=\left(\frac{t}{j}\right)^{1-p}-1 |

indicating that the number of links to a node grows as a function of the ratio of the current time to the node’s creation time, raised to the power of 1 − p 1-p .

The key insight from solving the deterministic model is that the fraction of nodes with a given number of links k k at time t t follows a power law distribution. Specifically, the probability that a node has k k links decays as k − α k^{-\alpha} , where α = 1 + 1 1 − p \alpha=1+\frac{1}{1-p} , a direct consequence of the rich-get-richer mechanism.

This derivation not only highlight the origin of the power law in network connectivity but also highlights the dependency of the power law exponent on the parameter p p , which modulates the balance between random and preferential linking. As p p decreases, emphasizing preferential attachment, the exponent α \alpha approaches 2, indicating a stronger rich-get-richer effect with a more pronounced tail in the distribution, allowing for a higher probability of nodes with very large numbers of links.

### B.2  Derivation of the power law exponent in the original Barabási-Albert model

The preferential attachment model [ 6 ] is based on two mechanisms: growth, where a new node is added at each time step, and preferential attachment, where each new node connects to m m existing nodes with a probability proportional to their degrees.

We denote the time as t t , with k i ​ ( t ) k_{i}(t) representing the degree of node i i at time t t . The preferential attachment probability for a node i i is given by

Π ​ ( k i ) = k i ​ ( t ) ∑ j k j ​ ( t ) = k i ​ ( t ) 2 ​ m ​ t , \displaystyle\Pi(k_{i})=\frac{k_{i}(t)}{\sum_{j}k_{j}(t)}=\frac{k_{i}(t)}{2mt}, |

(3) |

where ∑ j k j ​ ( t ) = 2 ​ E ​ ( t ) = 2 ​ m ​ t \sum_{j}k_{j}(t)=2E(t)=2mt , since each new node brings m m edges, and the total number of edges grows linearly with t t .

### Degree evolution equation

The expected increase in the degree of node i i when a new node is added is

d ​ k i ​ ( t ) d ​ t = m ⋅ Π ​ ( k i ) = m ⋅ k i ​ ( t ) 2 ​ m ​ t = k i ​ ( t ) 2 ​ t . \displaystyle\frac{dk_{i}(t)}{dt}=m\cdot\Pi(k_{i})=m\cdot\frac{k_{i}(t)}{2mt}=\frac{k_{i}(t)}{2t}. |

(4) |

### Solving the differential equation

This is a separable differential equation. We can separate variables as follows:

d ​ k i ​ ( t ) k i ​ ( t ) = d ​ t 2 ​ t . \displaystyle\frac{dk_{i}(t)}{k_{i}(t)}=\frac{dt}{2t}. |

(5) |

Integrating both sides:

∫ d ​ k i ​ ( t ) k i ​ ( t ) = ∫ d ​ t 2 ​ t , \displaystyle\int\frac{dk_{i}(t)}{k_{i}(t)}=\int\frac{dt}{2t}, |

(6) |

which gives

ln ⁡ k i ​ ( t ) = 1 2 ​ ln ⁡ t + C . \displaystyle\ln k_{i}(t)=\frac{1}{2}\ln t+C. |

(7) |

Exponentiating both sides, we get

k i ​ ( t ) = e C ⋅ t 1 / 2 . \displaystyle k_{i}(t)=e^{C}\cdot t^{1/2}. |

(8) |

To determine the constant e C e^{C} , note that at the time t i t_{i} when node i i was added, it has degree k i ​ ( t i ) = m k_{i}(t_{i})=m (since it brings m m edges upon introduction). Therefore,

k i ​ ( t i ) = m = e C ⋅ t i 1 / 2 . \displaystyle k_{i}(t_{i})=m=e^{C}\cdot t_{i}^{1/2}. |

(9) |

Solving for e C e^{C} , we find

e C = m ⋅ t i − 1 / 2 . \displaystyle e^{C}=m\cdot t_{i}^{-1/2}. |

(10) |

Substituting back into the equation for k i ​ ( t ) k_{i}(t) , we obtain

k i ​ ( t ) = m ⋅ ( t t i ) 1 / 2 . \displaystyle k_{i}(t)=m\cdot\left(\frac{t}{t_{i}}\right)^{1/2}. |

(11) |

### Degree distribution

The cumulative distribution function (CDF) P ​ ( k ) P(k) is the probability that a node has degree greater than or equal to k k at time t t . From the degree evolution equation, we have

k i ​ ( t ) = m ​ ( t t i ) 1 / 2 . \displaystyle k_{i}(t)=m\left(\frac{t}{t_{i}}\right)^{1/2}. |

(12) |

Solving for t i t_{i} , we get

t i = t ​ ( m k ) 2 . \displaystyle t_{i}=t\left(\frac{m}{k}\right)^{2}. |

(13) |

Since nodes are added uniformly over time, the probability that a node was introduced before time t i t_{i} is

P ​ ( t i ≤ t ′ ) = t ′ t . \displaystyle P(t_{i}\leq t^{\prime})=\frac{t^{\prime}}{t}. |

(14) |

Thus, the cumulative distribution function is

P ​ ( k ) = P ​ ( t i ≤ t i ) = t i t = ( m k ) 2 , \displaystyle P(k)=P(t_{i}\leq t_{i})=\frac{t_{i}}{t}=\left(\frac{m}{k}\right)^{2}, |

(15) |

which shows that the CDF follows a power law with exponent α = 2 \alpha=2 .

## References

[1]

Lada A. Adamic and Bernardo A. Huberman

“Zipf’s Law and the Internet”

In Glottometrics 3 , 2002, pp. 143–150

[2]

Chris Anderson

“The Long Tail”

Hyperion, 2012

[3]

Anthony B. Atkinson

“On the Measurement of Inequality”

In Journal of Economic Theory 2.3 , 1970, pp. 244–263

[4]

David Autor et al.

“The Fall of the Labor Share and the Rise of Superstar Firms”

In The Quarterly journal of economics 135.2

Oxford University Press, 2020, pp. 645–709

[5]

Albert-Laszlo Barabasi

“The origin of bursts and heavy tails in human dynamics”

In Nature 435.7039 , 2005, pp. 207–211

[6]

Albert-László Barabási and Réka Albert

“Emergence of scaling in random networks”

In Science 286.5439 , 1999, pp. 509–512

[7]

Albert-László Barabási, Natali Gulbahce and Joseph Loscalzo

“Network medicine: a network-based approach to human disease”

In Nature reviews genetics 12.1 , 2011, pp. 56–68

[8]

Hugo Barbosa et al.

“Human mobility: Models and applications”

In Physics Reports 734 , 2018, pp. 1–74

[9]

Ginestra Bianconi and Albert-László Barabási

“Competition and Multiscaling in Evolving Networks”

In Europhysics Letters 54.4 , 2001, pp. 436–442

[10]

Giulio Bottazzi and Angelo Secchi

“Explaining the distribution of firm growth rates”

In The RAND Journal of Economics 37.2

Wiley Online Library, 2006, pp. 235–256

[11]

Matthew Brennan

“Attention Factory: The story of TikTok and China’s ByteDance”

China Channel, 2020

[12]

Michal Brzezinski

“Do wealth distributions follow power laws? Evidence from ‘rich lists”’

In Physica A: Statistical Mechanics and its Applications 406 , 2014, pp. 155–162

[13]

Dennis W Carlton and Jeffrey M Perloff

“Modern industrial organization (4th Edition, Global)”

Pearson/Addison Wesley Boston, 2015

[14]

Fan Chung, Shirin Handjani and Doug Jungreis

“Generalizations of Polya’s urn problem”

In Annals of combinatorics 7 , 2003, pp. 141–153

[15]

Fan Chung and Linyuan Lu

“Concentration inequalities and martingale inequalities: a survey”

In Internet mathematics 3.1 , 2006, pp. 79–127

[16]

Aaron Clauset, Cosma Rohilla Shalizi and Mark EJ Newman

“Power-Law Distributions in Empirical Data”

In SIAM review 51.4 , 2009, pp. 661–703

[17]

Paul Covington, Jay Adams and Emre Sargin

“Deep neural networks for youtube recommendations”

In Proceedings of the 10th ACM conference on recommender systems , 2016, pp. 191–198

[18]

James Davidson et al.

“The YouTube video recommendation system”

In Proceedings of the fourth ACM conference on Recommender systems , 2010, pp. 293–296

[19]

Cory Doctorow

“‘Enshittification’ is Coming for Absolutely Everything” Accessed: 2025-02-25

In Financial Times , 2024

URL: https://www.ft.com/content/6fb1602d-a08b-4a8c-bac0-047b7d64aba5

[20]

Adrian Drăgulescu and Victor M Yakovenko

“Exponential and power-law probability distributions of wealth and income in the United Kingdom and the United States”

In Physica A: Statistical Mechanics and its Applications 299.1-2 , 2001, pp. 213–221

[21]

David Easley and Jon Kleinberg

“Networks, crowds, and markets: Reasoning about a highly connected world”

Cambridge University Press: Cambridge, 2010

[22]

Giana M Eckhardt, Katherine E Loveland, Lauren I Labrecque and Andrew N Smith

“The Creator Economy”

In Journal of Marketing 87.1

SAGE Publications, 2023, pp. 28–48

[23]

Lana El Sanyoura and Ashton Anderson

“Quantifying the Creator Economy: A Large-Scale Analysis of Patreon”

In Proceedings of the International AAAI Conference on Web and Social Media 16 , 2022, pp. 829–840

[24]

Lana El Sanyoura and Ashton Anderson

“Quantifying the creator economy: A large-scale analysis of patreon”

In Proceedings of the International AAAI Conference on Web and Social Media 16 , 2022, pp. 829–840

[25]

Financial Times

“YouTube Shorts takes on TikTok in battle for younger users”, 2023

URL: https://www.ft.com/content/300cb0dc-35d4-428a-aac4-45b1f140fc11

[26]

Financial Times

“YouTube: lucrative ad-sharing model puts platform ahead of rivals”, 2023

URL: https://www.ft.com/content/981a3d07-ee9e-4284-a47c-7e8786e8bc5a

[27]

Santo Fortunato, Alessandro Flammini, Filippo Menczer and Alessandro Vespignani

“Topical interests and the mitigation of search engine bias”

In Proceedings of the national academy of sciences 103.34 , 2006, pp. 12684–12689

[28]

Xavier Gabaix

“Power laws in economics and finance”

In Annu. Rev. Econ. 1.1 , 2009, pp. 255–294

[29]

Ananya Gairola

“Meta CEO Mark Zuckerberg: ’More Than 50% Of The Content People See On Instagram Is Now AI Recommended”’ Accessed: 2025-02-25

In Benzinga , 2024

URL: https://www.benzinga.com/news/24/04/38420928/meta-ceo-mark-zuckerberg-more-than-50-of-the-content-people-see-on-instagram-is-now-ai-recommended

[30]

Paul Geroski and Mariana Mazzucato

“Learning and the Sources of Corporate growth”

In Industrial and corporate change 11.4

Oxford University Press, 2002, pp. 623–644

[31]

Paul A Geroski and Mariana Mazzucato

“Modelling the dynamics of industry populations”

In International Journal of industrial organization 19.7

Elsevier, 2001, pp. 1003–1022

[32]

Colin S Gillespie

“Fitting Heavy Tailed Distributions: The poweRlaw Package”

In Journal of Statistical Software 64.2 , 2015, pp. 1–16

URL: https://doi.org/10.18637/jss.v064.i02

[33]

Tarleton Gillespie

“Custodians of the Internet: Platforms, Content Moderation, and the Hidden Decisions That Shape Social Media”

New Haven, CT: Yale University Press, 2018

[34]

Mo Houtti, Isaac Johnson, Morten Warncke-Wang and Loren Terveen

“Leveraging Recommender Systems to Reduce Content Gaps on Peer Production Platforms”

In Proceedings of the International AAAI Conference on Web and Social Media 18 , 2024, pp. 624–636

[35]

Xinyan Hu, Meena Jagadeesan, Michael I Jordan and Jacob Steinhardt

“Incentivizing high-quality content in online recommender systems”

In arXiv preprint arXiv:2306.07479 , 2023

[36]

Yiqing Hua et al.

“Characterizing alternative monetization strategies on YouTube”

In Proceedings of the ACM on Human-Computer Interaction CSCW2.6

ACM New York, NY, USA, 2022, pp. 1–30

[37]

Bernardo A. Huberman, Peter L. Pirolli, James E. Pitkow and Rajan M. Lukose

“Strong Regularities in World Wide Web Surfing”

In Science 280.5360 , 1998, pp. 95–97

[38]

Sidney Marie Hutson

“YouTube’s Adpocalypse: Patreon’s Perspective”, 2021

[39]

Nicole Immorlica, Meena Jagadeesan and Brendan Lucier

“Clickbait vs. quality: How engagement-based optimization shapes the content landscape in online platforms”

In Proceedings of the ACM on Web Conference 2024 , 2024, pp. 36–45

[40]

Influencer Marketing Hub

“Creator Earnings: Benchmark Report 2023” Accessed: 2024-11-13, 2023

URL: https://influencermarketinghub.com/creator-earnings-benchmark-report/

[41]

Matthew O Jackson

“Social and Economic Networks”

Princeton university press: Princeton, 2008

[42]

Rishabh Kumar

“Power-law Behaviour and Inequality in the Upper Tail of Wealth, Income and Consumption: Evidence from India”

In The Indian Economic Journal , 2024

[43]

Danial Ludwig and Victor M Yakovenko

“Physics-inspired analysis of the two-class income distribution in the USA in 1983–2018”

In Philosophical Transactions of the Royal Society A 380.2224

The Royal Society, 2022, pp. 20210162

[44]

Mariana Mazzucato and Ilan Strauss

“The Algorithm and Its Discontents” Accessed: 2025-02-25

In Project Syndicate , 2024

URL: https://www.project-syndicate.org/commentary/algorithm-governance-five-principles-to-prevent-ai-from-aggravating-digital-economy-harms-by-mariana-mazzucato-and-ilan-strauss-2024-02

[45]

Analytics Meta

“Notifications: Why Less is More — How Facebook Has Been Increasing Both User Satisfaction and App Usage” Accessed: 2024-11-28, 2021

URL: https://medium.com/@AnalyticsAtMeta/notifications-why-less-is-more-how-facebook-has-been-increasing-both-user-satisfaction-and-app-9463f7325e7d

[46]

Michael Mitzenmacher

“A brief history of generative models for power law and lognormal distributions”

In Internet mathematics 1.2 , 2004, pp. 226–251

[47]

Sarah E. Needleman

“Social-Media Influencers Aren’t Getting Rich -They’re Barely Getting By” Accessed: 2023-10-26

In The Wall Street Journal , 2023

URL: https://www.wsj.com/tech/social-media-influencers-arent-getting-rich-theyre-barely-getting-by-71e0aad3

[48]

Tim O’Reilly

“How to Fix AI’s Original Sin” Accessed: 2025-02-25

In O’Reilly Radar , 2024

URL: https://www.oreilly.com/radar/how-to-fix-ais-original-sin/

[49]

Tim O’Reilly, Ilan Strauss and Mariana Mazzucato

“Regulating Big Tech Through Digital Disclosures”, UCL Institute for Innovation and Public Purpose, 2023

URL: https://www.ucl.ac.uk/bartlett/public-purpose/sites/bartlett_public_purpose/files/oreilly_strauss_mazzucato_2023.regulating_big_tech_through_digital_disclosures.pdf

[50]

Tim O’Reilly, Ilan Strauss and Mariana Mazzucato

“Algorithmic attention rents: A theory of digital platform market power”

In Data & Policy 6 , 2024, pp. e6

[51]

Vilfredo Pareto

“Cours d’économie politique”

Lausanne: F. Rouge, 1896

[52]

Yoon-Joo Park and Alexander Tuzhilin

“The long tail of recommender systems and how to leverage it”

In Proceedings of the 2008 ACM conference on Recommender systems , 2008, pp. 11–18

[53]

Renana Peres, Martin Schreier, David A Schweidel and Alina Sorescu

“The creator economy: An introduction and a call for scholarly research”

In International Journal of Research in Marketing

Elsevier, 2024

[54]

R Core Team

“R: A Language and Environment for Statistical Computing”, 2024

R Foundation for Statistical Computing

URL: https://www.R-project.org/

[55]

Tobias Regner

“Crowdfunding a monthly income: an analysis of the membership platform Patreon”

In Journal of Cultural Economics 45.1 , 2021, pp. 133–142

[56]

Bernhard Rieder, Ariadna Matamoros-Fernández and Òscar Coromina

“From ranking algorithms to ‘ranking cultures’ Investigating the modulation of visibility in YouTube search results”

In Convergence 24.1 , 2018, pp. 50–68

[57]

Sherwin Rosen

“The economics of superstars”

In The American economic review 71.5 , 1981, pp. 845–858

[58]

Josh Schafer

“Mark Zuckerberg Says AI Boosts Monetization by 30% on Instagram, 40% on Facebook” Updated: April 27, 2023. Accessed: 2025-02-25

In Yahoo Finance , 2023

URL: https://finance.yahoo.com/news/mark-zuckerberg-says-ai-boosts-monetization-by-30-on-instagram-40-on-facebook-181123177.html

[59]

Ilan Strauss, Tim O’Reilly and Mariana Mazzucato

“Amazon’s Algorithmic Rents: The economics of information on Amazon”

In UC Law Science and Technology Journal , 2024

[60]

Richard S. Sutton and Andrew G. Barto

“Reinforcement Learning: An Introduction”

Cambridge, MA: MIT Press, 2018

URL: http://incompleteideas.net/book/the-book-2nd.html

[61]

Yong Tao et al.

“Exponential structure of income inequality: evidence from 67 countries”

In Journal of Economic Interaction and Coordination 14

Springer, 2019, pp. 345–376

[62]

TechCrunch

“As Meta Gets Rid of Fact-Checkers, Misinformation is Going Viral” Accessed: 2025-02-25

In TechCrunch , 2025

URL: https://techcrunch.com/2025/02/24/as-meta-gets-rid-of-fact-checkers-misinformation-is-going-viral/

[63]

Marc Vidal, Michael E Cusick and Albert-László Barabási

“Interactome networks and human disease”

In Cell 144.6 , 2011, pp. 986–998

[64]

Ivan Voitalov, Pim Hoorn, Remco Hofstad and Dmitri Krioukov

“Scale-free networks well done”

In Physical Review Research 1.3

APS, 2019

[65]

Fan Yao et al.

“Unveiling User Satisfaction and Creator Productivity Trade-Offs in Recommendation Platforms”

In arXiv preprint arXiv:2410.23683 , 2024

[66]

Anthony Zappin, Haroon Malik, Elhadi M Shakshuki and David A Dampier

“YouTube monetization and censorship by proxy: A machine learning prospective”

In Procedia Computer Science 198 , 2022, pp. 23–32

[67]

Eric Zhou and Dokyun Lee

“Generative artificial intelligence, human creativity, and art”

In PNAS Nexus 3.3

Oxford University Press US, 2024
