import { useState, useEffect } from "react";
import Papa from "papaparse";

function CsvDropEditor() {
    const [fileName, setFileName] = useState("");
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dbColumns, setDbColumns] = useState([]);
    const [matchedColumns, setMatchedColumns] = useState([]);

    const [nearMatchedColumns, setNearMatchedColumns] = useState([]);
    const [missingColumns, setMissingColumns] = useState([]);
    const [extraColumns, setExtraColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [manualMappings, setManualMappings] = useState({});

    const [selectedRows, setSelectedRows] = useState([]);




    // Fetch database columns on mount
    useEffect(() => {
        const fetchDbColumns = async () => {
            try {
                const response = await fetch("http://localhost:5552/api/db-columns");
                const result = await response.json();
                if (result.success) {
                    setDbColumns(result.columns);
                }
            } catch (error) {
                console.error("Error fetching DB columns:", error);
            }
        };
        fetchDbColumns();
    }, []);




    function addRow(row) { setRows(prevRows => [...prevRows, row]); }

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setLoading(true);
        setProgress(0);
        if (file) {
            setFileName(file.name);

            if (file.name.endsWith(".csv")) {
                // Parse CSV
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    step: (row) => {
                        console.log(row.data);

                        addRow(row.data);

                        // Update progress based on rows parsed
                        // (approximate since we don’t know total rows until complete) 
                        setProgress((prev) => Math.min(prev + 1, 100));
                        
                    }, complete: (result) => {
                        const parsedData = Array.isArray(result.data) ? result.data : [];
                       
                        console.log(parsedData);
                    
                        setLoading(false);
                        setProgress(100);
                        if (result.data.length > 0) { compareColumns(Object.keys(parsedData[0])); }
                    },
                });
            } else if (file.name.endsWith(".xml")) {
                
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(event.target.result, "application/xml");

                        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                            alert("Invalid XML file format.");
                            return;
                        }

                        // Get all ProductInformationForWeb nodes
                        const productNodes = Array.from(xmlDoc.getElementsByTagName("ProductInformationForWeb"));

                        const parsedRows = productNodes.map(node => {
                            const obj = {};

                            Array.from(node.children).forEach(child => {
                                if (child.children.length === 0) {
                                    // Simple element
                                    obj[child.tagName] = child.textContent;
                                } else {
                                    // Nested element
                                    if (child.tagName === "ProductDimensions") {
                                        Array.from(child.children).forEach(dim => {
                                            obj[`ProductDimensions_${dim.tagName}`] = dim.textContent;
                                        });
                                    } else if (child.tagName === "PublishingCategory") {
                                        Array.from(child.children).forEach(cat => {
                                            obj[`PublishingCategory_${cat.tagName}`] = cat.textContent;
                                        });
                                    } else if (child.tagName === "WarehouseStockLevels") {
                                        // Flatten each PortalWarehouseStockLevel
                                        Array.from(child.getElementsByTagName("PortalWarehouseStockLevel")).forEach((ws, idx) => {
                                            Array.from(ws.children).forEach(wsChild => {
                                                obj[`Warehouse_${idx + 1}_${wsChild.tagName}`] = wsChild.textContent;
                                            });
                                        });
                                    } else {
                                        // Generic flatten for other nested nodes
                                        Array.from(child.children).forEach(sub => {
                                            obj[`${child.tagName}_${sub.tagName}`] = sub.textContent;
                                        });
                                    }
                                }
                            });


                            setLoading(false);
                            setProgress(100);
                            return obj;
                        });

                        setRows(Array.isArray(parsedRows) ? parsedRows : []);

                        if (parsedRows.length > 0) {
                            compareColumns(Object.keys(parsedRows[0]));
                        }
                    };
                    reader.readAsText(file);
                }


             else {
                alert("Unsupported file type. Please drop a CSV or XML file.");
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleCellChange = (rowIndex, colKey, value) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex][colKey] = value;
        setRows(updatedRows);
    };

    const exportCsv = () => {
        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "edited.csv";
        link.click();
    };

    const filteredRows = Array.isArray(rows)
        ? rows.filter((row) =>
            row &&
            Object.values(row).some((val) =>
                String(val ?? "").toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : [];



    const updateDatabase = async () => {
        try {
            const response = await fetch("http://localhost:5552/api/update-csv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows }),
            });

            const result = await response.json();
            if (result.success) {
                alert("Database updated successfully!");
            } else {
                alert("Failed to update database.");
                console.log(result);
            }
        } catch (error) {
            console.error("Error updating database:", error);
        }
    };

    const compareColumns = (fileColumns) => {
        const matches = fileColumns.filter((col) => dbColumns.includes(col));
        const missingInDb = fileColumns.filter((col) => !dbColumns.includes(col));
        const extraInDb = dbColumns.filter((col) => !fileColumns.includes(col));

        // Find near matches
        const nearMatches = [];
        missingInDb.forEach((col) => {
            dbColumns.forEach((dbCol) => {
                const score = similarityScore(col, dbCol);
                if (score >= 0.7) { // threshold for "close enough"
                    nearMatches.push({ fileCol: col, dbCol, score });

                    console.log(missingColumns);
                    console.log(extraColumns);
                }
            });
        });

        setMatchedColumns(matches);
        setNearMatchedColumns(nearMatches);
        setMissingColumns(missingInDb);
        setExtraColumns(extraInDb);
    };

    useEffect(() => {
        if (rows.length > 0) {
            compareColumns(Object.keys(rows[0]));
        }
    }, rows);





    // VERY IMPORTANT, ALGORITHMIC WAY OF COMPARING STRINGS
    // VERY IMPORTANT, ALGORITHMIC WAY OF COMPARING STRINGS


    function levenshteinDistance(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () =>
            Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,      // deletion
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }

        return matrix[a.length][b.length];
    }

    function similarityScore(a, b) {
        const distance = levenshteinDistance(a, b);
        const maxLen = Math.max(a.length, b.length);
        return 1 - distance / maxLen; // 1 = identical, 0 = completely different
    }






    // Apply manual mappings to rows before insertion


    const applyMappings = (rows, manualMappings) => {
        return rows.map(row => {
            const newRow = {};
            Object.entries(row).forEach(([fileCol, val]) => {
                const targetCol = manualMappings[fileCol] || fileCol;
                newRow[targetCol] = val;
            });
            return newRow;
        });
    };

    const insertRowsToDb = async () => {
        const mappedRows = applyMappings(rows, manualMappings);

        try {
            const response = await fetch("http://localhost:5552/api/bulk-insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows: mappedRows }),
            });

            const result = await response.json();
            if (result.success) {
                alert("Rows inserted successfully!");
            } else {
                alert("Failed to insert rows.");
                console.log(result);
            }
        } catch (error) {
            console.error("Error inserting rows:", error);
        }
    };



    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
                border: "2px dashed #333",
                padding: "20px",
                width: "auto",
                margin: "20px auto",
                marginLeft: "100px",
                textAlign: "center",
                background: "#fafafa",
            }}
        >








            <p>Drag & Drop a CSV or XML file here</p>
            {fileName && <h4>File: {fileName}</h4>}

            {matchedColumns.length > 0 && (
                <div style={{ margin: "10px 0", color: "green" }}>
                    ✅ Matched Columns: {matchedColumns.join(", ")}
                </div>
            )}
            {/* Loading animation + progress bar */}
            {loading && (
                <div style={{ margin: "20px 0" }}>
                    <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #3498db", borderRadius: "50%", width: "30px", height: "30px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                    <div style={{ marginTop: "10px", width: "100%", background: "#ddd", borderRadius: "5px", }}>
                        <div style={{ width: `${progress}%`, height: "10px", background: "#4CAF50", borderRadius: "5px", transition: "width 0.3s ease" }}></div>
                    </div>
                    <p>{progress}%</p>
                </div>
            )}

          

            {nearMatchedColumns.length > 0 && (
                <div style={{ margin: "10px 0", color: "blue" }}>
                    🔍 Suggested Near Matches:
                    <ul>
                        {nearMatchedColumns.map((m, idx) => (
                            <li key={idx}>
                                File column <b>{m.fileCol}</b> ≈ DB column <b>{m.dbCol}</b> (score: {m.score.toFixed(2)})
                            </li>
                        ))}
                    </ul>
                </div>
            )}



            {rows.length > 0 && (
                <>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            marginBottom: "10px",
                            padding: "8px",
                            width: "100%",
                            border: "1px solid #ccc",
                        }}
                    />




                    {rows.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(rows[0]).map((fileCol, index) => (
                                        <th key={index}>
                                            {fileCol}
                                            <div>
                                                <select
                                                    value={manualMappings[fileCol] || ""}
                                                    onChange={(e) =>
                                                        setManualMappings((prev) => ({
                                                            ...prev,
                                                            [fileCol]: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <option value="">-- Map to DB column --</option>
                                                    {dbColumns.map((dbCol) => (
                                                        <option key={dbCol} value={dbCol}>
                                                            {dbCol}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, i) => (
                                    <tr key={i}>
                                        <td>
                                            <input type="checkbox" checked={selectedRows.includes(i)} onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRows((prev) => [...prev, i]);
                                                } else {
                                                    setSelectedRows((prev) => prev.filter((idx) => idx !== i));
                                                }
                                            }}
                                            />
                                        </td>
                                        {Object.entries(row).map(([colKey, val], j) => (
                                            <td key={j}>
                                                <input
                                                    type="text"
                                                    value={val}
                                                    onChange={(e) => handleCellChange(i, colKey, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <button
                        onClick={insertRowsToDb}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            background: "#673AB7",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Insert Mapped Columns as Rows into DB
                    </button>






                    <table style={{ width: "100%", marginTop: "10px" }}>
                        <thead>
                            <tr>
                                {Object.keys(rows[0]).map((col, index) => (
                                    <th
                                        key={index}
                                        style={{
                                            border: "1px solid black",
                                            padding: "8px",
                                            background: dbColumns.includes(col)
                                                ? "#c8e6c9"
                                                : "#ddd",
                                        }}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row, i) => (
                                <tr key={i}>
                                    {Object.entries(row).map(([colKey, val], j) => (
                                        <td
                                            key={j}
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                            }}
                                        >
                                            <input
                                                className="tbl_data"
                                                type="text"
                                                value={val}
                                                onChange={(e) =>
                                                    handleCellChange(i, colKey, e.target.value)
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>






                    <button
                        onClick={exportCsv}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Export Edited CSV
                    </button>
                </>
            )}

            <button
                onClick={updateDatabase}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#2196F3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Update Database
            </button>
        </div>
    );
}

export default CsvDropEditor;
