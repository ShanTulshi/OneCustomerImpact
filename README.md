# OneCustomerImpact

By the Azure Automation Portal team.

- Andreas Wieberneit
- Kevin Hughes
- Kevin Tran
- Lisa Li
- Miao Zi Wee
- Satya Malakapalli
- Shan Tulshi

OneCustomerImpact aims to make finding customer impacting incidents easier, by simplifying the process of searching for impacted customer subscriptions on any live site incident.

We hook into Microsoft's internal data pipeline and incident management utilities in order to scan for Azure subscription IDs related to any given incident, using the 3 automation services: Azure Automation, our own service for running PowerShell scripts; Azure Functions, to provide simple webhooks; and Microsoft Flow, for the data processing pipeline.

For demo purposes we have written OneCustomerImpact to work mostly with our own team's incidents - however, we have made the system highly extensible to easily support other types of incidents, even for other teams who may have different data pipelines.
