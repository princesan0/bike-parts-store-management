document.addEventListener("DOMContentLoaded", function() {
    let stock = [
        { itemType: 'TYRE', itemName: '2-75-18 REAR YK TL', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'TYRE01' },
        { itemType: 'TYRE', itemName: '2-75-17 BLASTER MAGIC TL', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'TYRE02' },
        { itemType: 'TYRE', itemName: '1000-20-18 P CEAT ROCK MAX X3 TT', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'TYRE03' },
        { itemType: 'TYRE', itemName: '4-00-8 SV 6 PR', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'TYRE04' },
        { itemType: 'TYRE', itemName: '2-75-18 ZR FRONT', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'TYRE05' },
        { itemType: 'CHAIN KIT', itemName: 'S/SPL', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN01' },
        { itemType: 'CHAIN KIT SCOOT', itemName: 'PULSAR', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN02' },
        { itemType: 'CHAIN KIT SCOOT', itemName: 'SHINE', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN03' },
        { itemType: 'CHAIN KIT', itemName: 'DIS 100', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN04' },
        { itemType: 'CHAIN KIT', itemName: 'LIBERO', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN05' },
        { itemType: 'CHAIN KIT', itemName: 'RTR 160 KIT 135', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN06' },
        { itemType: 'CHAIN KIT', itemName: 'D YUGA', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN07' },
        { itemType: 'CHAIN KIT', itemName: 'RTR 160', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN08' },
        { itemType: 'CHAIN KIT', itemName: 'STARCITY', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN09' },
        { itemType: 'CHAIN KIT', itemName: 'DISCOVER 125', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN10' },
        { itemType: 'CHAIN KIT', itemName: 'SZR', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN11' },
        { itemType: 'CHAIN KIT', itemName: 'SHINE SP', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN12' },
        { itemType: 'CHAIN KIT', itemName: 'SLINGSHOT', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN13' },
        { itemType: 'CHAIN KIT', itemName: 'PULSAR', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CHAIN14' },
        { itemType: 'CL PLATE MK', itemName: 'HH', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CLPLATE01' },
        { itemType: 'CL PLATE MK', itemName: 'UNICORN', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CLPLATE02' },
        { itemType: 'CL PLATE MK', itemName: 'FZ', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CLPLATE03' },
        { itemType: 'CL PLATE MK', itemName: 'SHINE', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'CLPLATE04' },
        { itemType: 'INNER ASSY MK', itemName: 'PULSAR 180 UG4', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'INNER01' },
        { itemType: 'INNER ASSY MK', itemName: 'SPLENDOR', quantity: 0, unit: 'pcs', rate: 0, amount: 0, code: 'INNER02' },
        // Continue this pattern for all items in the provided list...
    ];
    
    let sales = [];
    let invoiceCounter = 1;

    function addPurchasedItem(itemType, itemName, party, quantity, rate, code) {
        let item = stock.find(i => i.itemType === itemType && i.itemName === itemName && i.rate === rate && i.code === code);
        if (item) {
            item.quantity += quantity;
            item.amount = item.quantity * item.rate;
        } else {
            stock.push({ itemType, itemName, quantity, unit: 'pcs', rate, amount: quantity * rate, code });
        }
    }

    function showSection(sectionId) {
        const sections = document.querySelectorAll(".section");
        sections.forEach(section => {
            section.style.display = "none";
        });
        document.getElementById(sectionId).style.display = "block";
    }

    function showSuggestions(input, type) {
        const value = input.value.toLowerCase();
        let suggestions = stock
            .filter(item => item[type].toLowerCase().includes(value))
            .map(item => item[type])
            .filter((item, index, self) => self.indexOf(item) === index);
        
        const suggestionBox = document.getElementById(`${input.id}Suggestions`);
        suggestionBox.innerHTML = suggestions.map(s => `<div onclick="selectSuggestion('${input.id}', '${s}')">${s}</div>`).join('');
        suggestionBox.style.display = suggestions.length ? 'block' : 'none';
    }

    function selectSuggestion(inputId, value) {
        document.getElementById(inputId).value = value;
        document.getElementById(`${inputId}Suggestions`).style.display = 'none';
    }

    document.getElementById("saleForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const sale = {};
        formData.forEach((value, key) => {
            sale[key] = value;
        });
        
        const discount = parseFloat(sale.saleDiscount);
        const rate = parseFloat(sale.saleRate);
        const quantity = parseInt(sale.saleQuantity);
        const amount = quantity * rate * ((100 - discount) / 100);

        // Generate and save bill
        const invoiceNo = `invoice_no_${invoiceCounter}`;
        const date = new Date().toISOString().slice(0, 10);
        generateBill({ ...sale, amount, invoiceNo, date });

        // Save sale record
        sales.push({ ...sale, amount, invoiceNo, date });
        invoiceCounter++;

        alert(`Sale recorded successfully! Amount after discount: ${amount.toFixed(2)}`);
        event.target.reset();
    });

    document.getElementById("purchaseForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const purchase = {};
        formData.forEach((value, key) => {
            purchase[key] = value;
        });

        addPurchasedItem(purchase.purchaseItemType, purchase.purchaseItemName, purchase.purchaseParty, parseInt(purchase.purchaseQuantity), parseFloat(purchase.purchaseRate), purchase.purchaseCode);
        
        alert("Purchase recorded successfully!");
        console.log("Current stock:", stock);
        event.target.reset();
    });

    function viewStock() {
        const stockTable = document.getElementById("stockTable");
        stockTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Type</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Code/Serial No.</th>
                    </tr>
                </thead>
                <tbody>
                ${stock.map(item => `
                    <tr>
                        <td>${item.itemName}</td>
                        <td>${item.itemType}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unit}</td>
                        <td>${item.rate}</td>
                        <td>${item.amount}</td>
                        <td>${item.code}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
        `;
        styleTable(stockTable.querySelector("table"));
    }

    function styleTable(table) {
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.querySelectorAll("th, td").forEach(cell => {
            cell.style.border = "1px solid black";
            cell.style.padding = "8px";
            cell.style.textAlign = "left";
        });
        table.querySelectorAll("th").forEach(header => {
            header.style.backgroundColor = "#f2f2f2";
        });
    }

    function saveToExcel() {
        const fileName = prompt("Enter file name to save:", "inventory_data.xlsx");
        if (!fileName) {
            alert("File name cannot be empty.");
            return;
        }

        const workbook = XLSX.utils.book_new();
        const stockSheet = XLSX.utils.json_to_sheet(stock);
        XLSX.utils.book_append_sheet(workbook, stockSheet, "Stock");

        XLSX.writeFile(workbook, fileName);
        alert(`Data saved to ${fileName}`);
    }

    function generateBill(sale) {
        const workbook = XLSX.utils.book_new();
        const billData = [
            { A: 'Store Name', B: 'Mustak General Order Suppliers' },
            { A: 'Invoice No.', B: sale.invoiceNo },
            { A: 'Date', B: sale.date },
            { A: 'Party', B: sale.saleParty },
            { A: 'Item Type', B: sale.saleItemType },
            { A: 'Item Name', B: sale.saleItemName },
            { A: 'Quantity Sold', B: sale.saleQuantity },
            { A: 'Rate per Unit', B: sale.saleRate },
            { A: 'Discount (%)', B: sale.saleDiscount },
            { A: 'Total Amount', B: sale.amount.toFixed(2) },
            { A: 'Code/Serial No.', B: sale.saleCode }
        ];
        const billSheet = XLSX.utils.json_to_sheet(billData, { header: ['A', 'B'], skipHeader: true });
        XLSX.utils.book_append_sheet(workbook, billSheet, "Bill");

        const fileName = `${sale.invoiceNo}_${sale.date}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        alert(`Bill saved to ${fileName}`);
    }

    document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchCriteria = {};
        formData.forEach((value, key) => {
            searchCriteria[key] = value;
        });
        const searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = "";
        const results = stock.filter(item => 
            (!searchCriteria.searchItemType || item.itemType.includes(searchCriteria.searchItemType)) && 
            (!searchCriteria.searchItemName || item.itemName.includes(searchCriteria.searchItemName)) &&
            (!searchCriteria.searchCode || item.code.includes(searchCode))&&
            (!searchCriteria.searchItemType || item.itemType.includes(searchCriteria.searchItemType)) && 
            (!searchCriteria.searchItemName || item.itemName.includes(searchCriteria.searchItemName)) &&
            (!searchCriteria.searchCode || item.code.includes(searchCriteria.searchCode))
        );
        results.forEach(item => {
            const resultItem = `<p>${item.itemType} - ${item.itemName} | Quantity: ${item.quantity} | Unit: ${item.unit} | Rate: ${item.rate} | Amount: ${item.amount} | Code/Serial No.: ${item.code}</p>`;
            searchResults.innerHTML += resultItem;
        });
        if (results.length === 0) {
            searchResults.innerHTML = "<p>No items found.</p>";
        }
    });
    
    window.showSection = showSection;
    window.showSuggestions = showSuggestions;
    window.selectSuggestion = selectSuggestion;
    window.viewStock = viewStock;
    window.saveToExcel = saveToExcel;
    window.generateBill = generateBill;
    });
    let billItems = [];
let billCounter = 1;

function addBillingItem() {
    const container = document.getElementById("billingItemsContainer");
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("billing-item");
    itemDiv.innerHTML = `
        <label>Item Type:</label>
        <input type="text" class="itemType" required oninput="showSuggestions(this, 'type')">
        <div class="suggestions"></div>

        <label>Item Name:</label>
        <input type="text" class="itemName" required oninput="showSuggestions(this, 'name')">
        <div class="suggestions"></div>

        <label>Quantity:</label>
        <input type="number" class="quantity" required>

        <label>Rate:</label>
        <input type="number" class="rate" step="0.01" required>
    `;
    container.appendChild(itemDiv);
}

document.getElementById("billingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const date = document.getElementById("billingDate").value;
    const items = Array.from(document.querySelectorAll(".billing-item")).map(item => {
        return {
            itemType: item.querySelector(".itemType").value,
            itemName: item.querySelector(".itemName").value,
            quantity: parseInt(item.querySelector(".quantity").value),
            rate: parseFloat(item.querySelector(".rate").value),
        };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const invoiceNo = `RB-${billCounter}`;

    const billData = { customerName, date, items, totalAmount, invoiceNo };
    billItems.push(billData);

    displayGeneratedBill(billData);
    billCounter++;
});

function displayGeneratedBill(billData) {
    const billContainer = document.getElementById("generatedBill");
    billContainer.innerHTML = `
        <p><strong>Customer Name:</strong> ${billData.customerName}</p>
        <p><strong>Date:</strong> ${billData.date}</p>
        <p><strong>Invoice No:</strong> ${billData.invoiceNo}</p>
        <table>
            <thead>
                <tr>
                    <th>Item Type</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${billData.items.map(item => `
                    <tr>
                        <td>${item.itemType}</td>
                        <td>${item.itemName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.rate}</td>
                        <td>${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4"><strong>Total</strong></td>
                    <td>${billData.totalAmount.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `;
}

function saveBillAsExcel() {
    const billData = billItems[billItems.length - 1];
    if (!billData) {
        alert("No bill to save!");
        return;
    }

    const workbook = XLSX.utils.book_new();
    const sheetData = [
        { A: 'Customer Name', B: billData.customerName },
        { A: 'Date', B: billData.date },
        { A: 'Invoice No.', B: billData.invoiceNo },
        ...billData.items.map(item => ({
            A: item.itemType,
            B: item.itemName,
            C: item.quantity,
            D: item.rate,
            E: item.quantity * item.rate
        })),
        { A: 'Total', E: billData.totalAmount }
    ];
    const sheet = XLSX.utils.json_to_sheet(sheetData, { header: ['A', 'B', 'C', 'D', 'E'], skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, sheet, "Retailer Bill");

    const fileName = `${billData.invoiceNo}_${billData.date}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    alert(`Bill saved as ${fileName}`);
}
function addBillingItem() {
    const container = document.getElementById("billingItemsContainer");
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("billing-item");
    itemDiv.innerHTML = `
        <label>Item Type:</label>
        <input type="text" class="itemType" required oninput="showSuggestions(this, 'type')">
        <div class="suggestions"></div>

        <label>Item Name:</label>
        <input type="text" class="itemName" required oninput="showSuggestions(this, 'name')">
        <div class="suggestions"></div>

        <label>Quantity:</label>
        <input type="number" class="quantity" required>

        <label>Rate:</label>
        <input type="number" class="rate" step="0.01" required>
    `;
    container.appendChild(itemDiv);
}

document.getElementById("billingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const customerAddress = document.getElementById("customerAddress").value;
    const date = document.getElementById("billingDate").value;

    const items = Array.from(document.querySelectorAll(".billing-item")).map(item => {
        return {
            itemType: item.querySelector(".itemType").value,
            itemName: item.querySelector(".itemName").value,
            quantity: parseInt(item.querySelector(".quantity").value),
            rate: parseFloat(item.querySelector(".rate").value),
        };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const invoiceNo = `RB-${billCounter}`;

    const billData = { customerName, customerAddress, date, items, totalAmount, invoiceNo };
    billItems.push(billData);

    displayGeneratedBill(billData);
    billCounter++;
});

function displayGeneratedBill(billData) {
    const billContainer = document.getElementById("generatedBill");
    billContainer.innerHTML = `
        <p><strong>Customer Name:</strong> ${billData.customerName}</p>
        <p><strong>Customer Address:</strong> ${billData.customerAddress}</p>
        <p><strong>Date:</strong> ${billData.date}</p>
        <p><strong>Invoice No:</strong> ${billData.invoiceNo}</p>
        <table>
            <thead>
                <tr>
                    <th>Item Type</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${billData.items.map(item => `
                    <tr>
                        <td>${item.itemType}</td>
                        <td>${item.itemName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.rate}</td>
                        <td>${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4"><strong>Total</strong></td>
                    <td>${billData.totalAmount.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `;
}

function saveBillAsExcel() {
    const billData = billItems[billItems.length - 1];
    if (!billData) {
        alert("No bill to save!");
        return;
    }

    const workbook = XLSX.utils.book_new();
    const sheetData = [
        { A: 'Customer Name', B: billData.customerName },
        { A: 'Customer Address', B: billData.customerAddress },
        { A: 'Date', B: billData.date },
        { A: 'Invoice No.', B: billData.invoiceNo },
        ...billData.items.map(item => ({
            A: item.itemType,
            B: item.itemName,
            C: item.quantity,
            D: item.rate,
            E: item.quantity * item.rate
        })),
        { A: 'Total', E: billData.totalAmount }
    ];
    const sheet = XLSX.utils.json_to_sheet(sheetData, { header: ['A', 'B', 'C', 'D', 'E'], skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, sheet, "Retailer Bill");

    const fileName = `${billData.invoiceNo}_${billData.date}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    alert(`Bill saved as ${fileName}`);
}
