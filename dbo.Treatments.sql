CREATE TABLE [dbo].[Treatments] (
    [TreatmentID]   INT             IDENTITY (1, 1) NOT NULL,
    [TreatmentName] VARCHAR (100)   NULL,
    [TimeOfCare]    INT             NULL,
    [PriceMin]      DECIMAL (10, 2) NULL,
    PRIMARY KEY CLUSTERED ([TreatmentID] ASC)
);

