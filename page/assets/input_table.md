## Simple Table

Input Syntax

    |Group 1|Group 2|Group 3|Group 4| 
    |-------|-------|-------|-------|
    |Item 1 |Item 2 |Item 3 |Item 4 |
    |Item 1 |Item 2 |Item 3 |Item 4 |
    |Item 1 |Item 2 |Item 3 |Item 4 |

Test Result

|Group 1|Group 2|Group 3|Group 4| 
|-------|-------|-------|-------|
|Item 1 |Item 2 |Item 3 |Item 4 |
|Item 1 |Item 2 |Item 3 |Item 4 |
|Item 1 |Item 2 |Item 3 |Item 4 |

Answer

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

Input Syntax

    +-------+-------+-------+-------+
    |Group 1|Group 2|Group 3|Group 4|
    +=======+=======+=======+=======+
    |Item 1 |Item 2 |Item 3 |Item 4 |
    +-------+-------|       |       |
    |Item 1 |Item 2 |       |       |
    +-------|       |-------|       |
    |Item 1 |       |Item 3 |       |
    +-------+-------+-------+-------+

Test Result

+-------+-------+-------+-------+
|Group 1|Group 2|Group 3|Group 4|
+=======+=======+=======+=======+
|Item 1 |Item 2 |Item 3 |Item 4 |
+-------+-------|       |       |
|Item 1 |Item 2 |       |       |
+-------|       |-------|       |
|Item 1 |       |Item 3 |       |
+-------+-------+-------+-------+

Answer

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

# Grid Table

+-------+-------+-------+-------+-------+-------+-------+
| Left Top      | CenterTop     | Right Top     | Item1 |
|               |               |               |-------|
|               |               |               | Item2 |
|'--------------+'-------------'+--------------'+-------+
| Left Middle   | Center Middle | Right Middle  | Item3 |
|               |               |               |-------|
|               |               |               | Item3 |
|:------+-------+:------+------:+--------------:|-------|
| Left Bottom   | Center Bottom | Right Bottom  |       |
|               |               |               |-------|
|               |               |               |       |
|.------+-------+.------+------.+--------------.|=======|
|       |       |       |       |       |       |       |
|-------+-------+-------+-------+-------+-------|       |
|               |       |         Merged\       |       |
|-------+-------+-------|   Header              |-------|
|       |               |       Cell            |       |
+-------+-------+-------+=======================+-------+