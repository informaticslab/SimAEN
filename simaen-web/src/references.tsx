/*
# DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

# This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
# Any opinions,findings, conclusions or recommendations expressed in this material are those
# of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

# (c) 2021 Massachusetts Institute of Technology.

# The software/firmware is provided to you on an As-Is basis

# Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
# or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
# are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
# other than as specifically authorized by the U.S. Government may violate any copyrights that
# exist in this work.

# Copyright (c) 2021 Massachusetts Institute of Technology
# SPDX short identifier: MIT

# Developed as part of: SimAEN, 2021
*/

export type LitReference = {
  Authors: string;
  Title: string;
  Date: string;
  Publication: string;
  Href: string;
  LinkText: string
};

export const references = {
  simaen_phr: {
    Authors: "Streilein B., Finklea L., Schuldt D., Schiefelbein, M. C., Yahalom R., Ali H., Norige A.",
    Title: "Evaluating COVID-19 Exposure Notification Effectiveness With SimAEN: A Simulation Tool Designed for Public Health Decision Making",
    Date: "2022, August 30",
    Publication: "Public Health Reports",
    Href: "https://journals.sagepub.com/doi/full/10.1177/00333549221116361",
    LinkText: "https://journals.sagepub.com/doi/full/10.1177/00333549221116361",
  },
  simaen_report: {
    Authors: "Schuldt D. W., Londner T., Saunders J., Norige A., Schiefelbein C., Yahalom R., Streilein W.",
    Title: "The Simulation of Automated Exposure Notification (SimAEN) Model",
    Date: "2022, April 15",
    Publication: "MIT Lincoln Laboratory",
    Href: "https://www.ll.mit.edu/sites/default/files/publication/doc/simulation-automated-exposure-notification-(simaen)-schuldt-acta-5.pdf,
    LinkText: "https://www.ll.mit.edu/sites/default/files/publication/doc/simulation-automated-exposure-notification-(simaen)-schuldt-acta-5.pdf",
  },

  briers: {
    Authors: "Briers M., Homes C., Fraser C.",
    Title: "Demonstrating the impact of the NHS COVID-19 app",
    Date: "2021, February 9",
    Publication: "The Alan Turing Institute",
    Href: "https://www.turing.ac.uk/blog/demonstrating-impact-nhs-covid-19-app",
    LinkText: "https://www.turing.ac.uk/blog/demonstrating-impact-nhs-covid-19-app",
  },

  pluss: {
    Authors: "Pluss J. D.",
    Title: "Top epidemiologist urges greater uptake of contact-tracing app",
    Date: "2020, October 20",
    Publication: "swissinfo.ch",
    Href: "https://www.swissinfo.ch/eng/top-epidemiologist-urges-greater-uptake-of-contact-tracing-app/46108064",
    LinkText: "https://www.swissinfo.ch/eng/top-epidemiologist-urges-greater-uptake-of-contact-tracing-app/46108064",
  },

  pierlinck: {
    Authors: "Pierlinck, M., Linka, K., Costabal, F. S., & Kuhl, E.",
    Title: "Outbreak dynamics of COVID-19 in China and the United States",
    Date: "2020, April",
    Publication: "Biomechanics and Modeling in Mechanobiology",
    Href: "https://pubmed.ncbi.nlm.nih.gov/32342242/",
    LinkText: 'doi:10.1007/s10237-020-01332-5'
  },

  backer: {
    Authors: "Backer, J. A., Klinkenberg, D., & Wallinga, J.",
    Title: "Incubation period of 2019 novel coronavirus (2019-nCoV) infections among travellers from Wuhan, China, 20-28 January 2020",
    Date: "2020",
    Publication: "European communicable disease bulletin, 25(5), 20-28",
    Href: "https://www.eurosurveillance.org/content/10.2807/1560-7917.ES.2020.25.5.2000062",
    LinkText: "doi:10.2807/1560-7917.ES.2020.25.5.2000062"
  },

  watson: {
    Authors: "Watson, J., Whiting, P. F., & Brush, J. E.",
    Title: "Interpreting a COVID-19 test result",
    Date: "2020",
    Publication: "Bristol Journal of Medicine",
    Href: "https://www.bmj.com/content/369/bmj.m1808",
    LinkText: "doi:10.1136/bmj.m1808"
  },

  poletti: {
    Authors: "Poletti, P., Tirani, M., Cereda, D., Trentini, F., Guzzetta, G., Sabatino, G., . . . Merler, S.",
    Title: "Probability of symptoms and critical disease after SARS-CoV-2 infection",
    Date: "2020, June 22",
    Publication: "arXiv",
    Href: "https://arxiv.org/abs/2006.08471",
    LinkText: "arXiv:2006.08471",
  },

  laxminarayan: {
    Authors: "Laxminarayan, R., Wahl, B., Dudala, S. R., Gopal, K., Mohan, C., Neelima, S., . . . Lewnard, J.",
    Title: "Epidemiology and transmission dynamics of COVID-19 in two Indian states",
    Date: "2020, September",
    Publication: "Science",
    Href: "https://science.sciencemag.org/content/370/6517/691",
    LinkText: "doi:10.1126/science.abd7672"
  },

  fu: {
    Authors: "Fu, Y.",
    Title: "Measuring personal networks with daily contact: a single-item survey question and the contact diary",
    Date: "2005",
    Publication: "Social Networks, 27, 79-90",
    Href: "https://www.sciencedirect.com/science/article/pii/S0378873305000092",
    LinkText: "doi:10.1016/j.socnet.2005.01.008"
  },

  lazer: {
    Authors: "Lazer, D., Santillana, M., Perlis, R. H., Ognyanova, K., Baum, M. A., Quintana, A., . . . Simonson, M.",
    Title: "The COVID States Project #8: Failing the test",
    Date: "2020, August 12",
    Publication: "OSF Preprints",
    Href: "https://osf.io/gj9x8",
    LinkText: "doi:10.31219/osf.io/gj9x8"
  },
};