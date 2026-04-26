## Simple Table
Syntax
    |Group 1|Group 2|Group 3|Group 4| 
    |-------|-------|-------|-------|
    |Item 1 |Item 2 |Item 3 |Item 4 |
    |Item 1 |Item 2 |Item 3 |Item 4 |
    |Item 1 |Item 2 |Item 3 |Item 4 |
Result

<table>
<tr>
<th>Group 1</th>
<th>Group 2</th>
<th>Group 3</th>
<th>Group 4</th>
</tr>
<tr>
<td>Item1</td>
<td>Item2</td>
<td>Item3</td>
<td>Item4</td>
</tr>
<tr>
<td>Item1</td>
<td>Item2</td>
<td>Item3</td>
<td>Item4</td>
</tr>
<tr>
<td>Item1</td>
<td>Item2</td>
<td>Item3</td>
<td>Item4</td>
</tr>
</table>

## Grid Table

Syntax

    +-------+-------+-------+-------+
    |Group 1|Group 2|Group 3|Group 4|
    +=======+=======+=======+=======+
    |Item 1 |Item 2 |Item 3 |Item 4 |
    +-------+-------|       |       |
    |Item 1 |Item 2 |       |       |
    +-------|       |-------|       |
    |Item 1 |       |Item 3 |       |
    +-------+-------+-------+-------+
Result

<table>
<tr>
<th>Group 1</th>
<th>Group 2</th>
<th>Group 3</th>
<th>Group 4</th>
</tr>
<tr>
<td>Item1</td>
<td>Item2</td>
<td rowspan="2">Item3</td>
<td rowspan="3">Item4</td>
</tr>
<tr>
<td>Item1</td>
<td rowspan="2">Item2</td>
</tr>
<tr>
<td>Item1</td>
<td>Item3</td>
</tr>
</table>