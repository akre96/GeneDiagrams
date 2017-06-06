# Gene Circuit Drawer

This application is designed to make the process of drawing Gene Circuits easier and to scale.
This project was created for and funded by the Mills Lab at UC-Davis.

## Using the tool

To create a gene diagram you may either upload a genbank file or manually input genes to create a figure. 

### Overall Figure Options:

**Max Length:** The number of base pairs of the largest genome you will be comparing your figure too. This is in order to keep everything scaled relative to a maximum. For example if you have three species to compare, find the length of the longest and set Max Length to that one.

**Block Height:** Scale between 0 and 100 to determine how tall/thick each gene is

**Arrow Length:** Fixes length of arrows on blocks to be a percentage (0.00-100). Recommended to be 1 or below.  

**Range:** For uploaded files, parse a certain range of the sequence for genes

After changing any of the above options the reload button must be hit. 

### Individual Gene Options:

**Gene:** Name of gene

**Length:** Length in base pairs of gene

**Color:** Color of block, either in english(red,green,blue,maroon,etc.) or hex (#ffffff)

**Direction:** Forward (right facing arrow) or backward (left facing arrow) for gene. Non Coding sets color to trasnparent.

**Arrow Only:** Checkbox to determine if the gene should only be a triangle and no rectangular portion.






### Notes
-- Arrow length is as a percent of total SVG width

-- When parsing GenBank files overlaps of <10bp are set to 0. Anything >than 10bp overlap is deleted

-- Gene names from GenBank files are the predicted function by default. Will be set to the Locus_tag if no predicted function, and if neither name is set to "No Name"

-- I have no idea what would happen if you added a gene manually to an uploaded files diagram



Sincerely,

Samir Akre