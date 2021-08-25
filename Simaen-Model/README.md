<!--
*** This template is from https://github.com/othneildrew/Best-README-Template
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://arxiv.org/abs/2012.04399">
    <img src="images/simaen.png" alt="Logo" width="600" height="58">
  </a>

  <h3 align="center">SimAEN -- Simulated Automated Exposure Notification</h3>

  <p align="center">
    An agent-based model of the public health workflow for exploring the effects of disease mitigation strategies
    <br />
    <a href="https://arxiv.org/abs/2012.04399"><strong>Read the paper »</strong></a>
    <br />
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Many attempts have been made to model the spread of disease in order to estimate the impact. In this model the focus is placed on public health instead of the general public. By understanding the staffing requirements, number of quarantines, and relative changes in rate of spread associated with a particular posture, public health has the ability to determine if adopting a specific suite of tools will meet their needs.

The current model implements:
* Manual Contact Tracing (MCT)
* Automatic Exposure Notification (AEN)
* Testing
* Vaccination

The SimAEN model is an agent-based model, which means that the abstraction of disease spread is driven down to the lowest level: the individual. Since disease is fundametally a human centered problem it makes sense to model from this perspective. However, unlike typical agent-based models SimAEN instantiated individuals on an "as needed" basis. This means that only infected individuals and people who have interacted with them are modeled, instead of keeping track of an entire latent population. Even in wide-ranging epidemics it is typical that only a small fraction of the overall population is infected. As such, modeling uninfected individuals is a waste of computational resources. By only modeling the individuals that matter SimAEN is able to produce results in a timely manner.

This speed is a critical to enabling exploration of the space of unknowns. Even a year into the COVID-19 epidemic it is unclear exactly what value all of the parameters in the model should be set to. But, by running a range of potential values the model provides insight into the outcomes that may be observed. Since SimAEN is stochastic two runs will produced different results even with identical input parameters. The low computational cost permits multiple simulations of a given parameter set to capture the variance in possible outcomes.

### Built With

* [Python](https://python.org)
* [Numpy](https://numpy.org)
* [JSON](https://json.org)
* [SQLite](https://sqlite.org)



<!-- GETTING STARTED -->
## Getting Started

SimAEN is runable directly after downloading. The main model is located in <tt>WorkflowModel.py</tt> and an example invokation is seen in <tt>simaen_run.py</tt>

<!-- USAGE EXAMPLES -->
## Usage

There are several components that need to be considered in the execution of SimAEN. All of the parameters can be found in <tt>config.txt</tt>. This file can be read in using <tt>readConfig()</tt> (located in <tt>readConfig.py</tt>) to properly format them for use by <tt>WorkflowModel.py</tt>. The output of <tt>WorkflowModel.main()</tt> is a handle to a database containing all of the outputs needed for further processing. This includes tables for <tt>INDIVIDUALS</tt>, <tt>TESTS</tt>, <tt>CALLS</tt>, and <tt>SETUP</tt>. Further information about these tables can be seen in the <tt>World</tt> class of <tt>WorkflowModel.py</tt>. 

An example database processing routine is provided in <tt>webUIprocess.py</tt>. Here the <tt>process()</tt> method shows how to extract the desired information. This is the method used to produce the results seen on the SimAEN website <ADD URL>.
<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

The SimAEN Team - simaen@ll.mit.edu

Project Link: [<ADD URL>](<ADD URL>)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: <ADD https://img.shields.io/ LOCATION>
[license-url]: <ADD LICENSE URL>