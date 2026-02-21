console.log("PDF & Image Master Suite Loaded");

const { jsPDF } = window.jspdf;
const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;

// App Controller
const app = {
    currentView: 'start', // 'start' or 'editor'
    currentTool: null,

    init: () => {
        app.renderToolsList();
        app.setupEventListeners();
    },

    setupEventListeners: () => {
        // Sidebar Navigation
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.addEventListener('click', (e) => {
                const text = item.innerText.trim();
                if (text === 'Home') app.openStartScreen();
                // Other sidebar items are mockups for now
            });
        });

        // Search
        const searchInput = document.querySelector('.search-box input');
        searchInput.addEventListener('input', (e) => {
            app.renderToolsList(e.target.value);
        });

        // Ribbon Tabs
        document.querySelectorAll('.ribbon-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                if (tab.id === 'tab-file') {
                    app.openStartScreen();
                } else {
                    app.switchTab(tabId);
                }
            });
        });

        // Window Controls (Mockup)
        document.querySelector('.window-control.close').addEventListener('click', () => {
            alert('This is a web app, please close the browser tab to exit.');
        });
    },

    openStartScreen: () => {
        document.getElementById('start-screen').style.display = 'flex';
        document.getElementById('editor-screen').style.display = 'none';
        app.currentView = 'start';
    },

    openEditor: () => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('editor-screen').style.display = 'flex';
        app.currentView = 'editor';
        app.switchTab('home'); // Default to home tab
    },

    loadTool: (toolId) => {
        if (!tools[toolId]) return;

        app.currentTool = toolId;
        app.openEditor();

        // Render Tool HTML
        const container = document.getElementById('tool-container');
        container.innerHTML = tools[toolId].content;

        // Initialize Tool Logic
        if (tools[toolId].init) {
            tools[toolId].init();
        }
    },

    switchTab: (tabId) => {
        // Update Tab UI
        document.querySelectorAll('.ribbon-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.ribbon-tab[data-tab="${tabId}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Update Toolbar Content (Dynamic based on tab)
        const toolbar = document.getElementById('ribbon-toolbar');
        toolbar.innerHTML = app.getToolbarContent(tabId);
    },

    getToolbarContent: (tabId) => {
        // Define toolbar buttons for each tab
        if (tabId === 'home') {
            return `
                <div class="ribbon-group">
                    <button class="ribbon-btn" onclick="app.openStartScreen()">
                        <i class="fa-regular fa-folder-open"></i>
                        <span>Open</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('scan-pdf')">
                        <i class="fa-solid fa-camera"></i>
                        <span>Scan</span>
                    </button>
                </div>
                <div class="ribbon-divider"></div>
                <div class="ribbon-group">
                    <button class="ribbon-btn" onclick="app.loadTool('compress-pdf')">
                        <i class="fa-solid fa-file-invoice"></i>
                        <span>Compress</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('merge-pdf')">
                         <i class="fa-solid fa-object-group"></i>
                        <span>Merge</span>
                    </button>
                     <button class="ribbon-btn" onclick="app.loadTool('remove-pages')">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>Remove</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('organize-pdf')">
                        <i class="fa-solid fa-sort"></i>
                        <span>Organize</span>
                    </button>
                </div>
            `;
        } else if (tabId === 'convert') {
            return `
                <div class="ribbon-group">
                    <button class="ribbon-btn" onclick="app.loadTool('image-to-pdf')">
                        <i class="fa-solid fa-images"></i>
                        <span>Img to PDF</span>
                    </button>
                     <button class="ribbon-btn" onclick="app.loadTool('word-to-pdf')">
                        <i class="fa-solid fa-file-word"></i>
                        <span>Word</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('excel-to-pdf')">
                        <i class="fa-solid fa-file-excel"></i>
                        <span>Excel</span>
                    </button>
                     <button class="ribbon-btn" onclick="app.loadTool('html-to-pdf')">
                        <i class="fa-solid fa-code"></i>
                        <span>HTML</span>
                    </button>
                </div>
                <div class="ribbon-divider"></div>
                <div class="ribbon-group">
                    <button class="ribbon-btn" onclick="app.loadTool('pdf-to-image')">
                        <i class="fa-solid fa-file-image"></i>
                        <span>PDF to Img</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('ocr-pdf')">
                        <i class="fa-solid fa-eye"></i>
                        <span>OCR</span>
                    </button>
                </div>
            `;
        } else if (tabId === 'edit') {
            return `
                <div class="ribbon-group">
                    <button class="ribbon-btn" onclick="app.loadTool('rotate-pdf')">
                        <i class="fa-solid fa-rotate-right"></i>
                        <span>Rotate</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('add-page-numbers')">
                        <i class="fa-solid fa-list-ol"></i>
                        <span>Page #</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('watermark-pdf')">
                        <i class="fa-brands fa-markdown"></i>
                        <span>Watermark</span>
                    </button>
                </div>
                 <div class="ribbon-divider"></div>
                <div class="ribbon-group">
                    <button class="ribbon-btn" onclick="app.loadTool('sign-pdf')">
                        <i class="fa-solid fa-signature"></i>
                        <span>Sign</span>
                    </button>
                    <button class="ribbon-btn" onclick="app.loadTool('protect-pdf')">
                        <i class="fa-solid fa-lock"></i>
                        <span>Protect</span>
                    </button>
                     <button class="ribbon-btn" onclick="app.loadTool('unlock-pdf')">
                        <i class="fa-solid fa-unlock"></i>
                        <span>Unlock</span>
                    </button>
                </div>
            `;
        } else {
            return `<div style="padding: 10px; color: #777;">Tools for ${tabId} coming soon...</div>`;
        }
    },

    renderToolsList: (filter = '') => {
        const listContainer = document.getElementById('tools-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        Object.keys(tools).forEach(key => {
            const tool = tools[key];
            if (filter && !tool.title.toLowerCase().includes(filter.toLowerCase())) return;

            const item = document.createElement('div');
            item.className = 'tool-list-item';
            // Simple mapping of icons
            let iconClass = 'fa-file';
            if (key.includes('compress')) iconClass = 'fa-file-zipper';
            if (key.includes('image')) iconClass = 'fa-image';
            if (key.includes('merge')) iconClass = 'fa-object-group';
            if (key.includes('split')) iconClass = 'fa-scissors';
            if (key.includes('sign')) iconClass = 'fa-signature';

            item.innerHTML = `
                <div class="tool-icon"><i class="fa-solid ${iconClass}"></i></div>
                <div class="tool-info">
                    <h4>${tool.title}</h4>
                    <p>Click to open tool</p>
                </div>
            `;
            item.onclick = () => app.loadTool(key);
            listContainer.appendChild(item);
        });
    }
};

// Tool Definitions (Same content as before, just ensuring IDs match)
const tools = {
    'calc-business': {
        title: 'Business Calculator',
        content: `
            <h2>Business Calculator (Margin/Markup)</h2>
            <form id="calc-business-form" class="calculator-form">
                <div class="form-group">
                    <label>Cost Price</label>
                    <input type="number" name="cost" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Revenue / Selling Price</label>
                    <input type="number" name="revenue" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-business-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcBusiness
    },
    'calc-gst': {
        title: 'GST Calculator',
        content: `
            <h2>GST Calculator</h2>
            <form id="calc-gst-form" class="calculator-form">
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" name="amount" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>GST Rate (%)</label>
                    <input type="number" name="rate" class="form-control" required step="any" value="18">
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select name="type" class="form-control">
                        <option value="exclusive">GST Exclusive (Add GST)</option>
                        <option value="inclusive">GST Inclusive (Remove GST)</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-gst-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcGst
    },
    'calc-pnl': {
        title: 'Profit & Loss Calculator',
        content: `
            <h2>Profit & Loss Calculator</h2>
            <form id="calc-pnl-form" class="calculator-form">
                <div class="form-group">
                    <label>Cost Price</label>
                    <input type="number" name="cp" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Selling Price</label>
                    <input type="number" name="sp" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-pnl-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcPnl
    },
    'calc-roi': {
        title: 'ROI Calculator',
        content: `
            <h2>ROI Calculator</h2>
            <form id="calc-roi-form" class="calculator-form">
                <div class="form-group">
                    <label>Total Investment</label>
                    <input type="number" name="investment" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Returned Value</label>
                    <input type="number" name="ret" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-roi-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcRoi
    },
    'calc-loan': {
        title: 'Loan / EMI Calculator',
        content: `
            <h2>Loan / EMI Calculator</h2>
            <form id="calc-loan-form" class="calculator-form">
                <div class="form-group">
                    <label>Loan Amount (Principal)</label>
                    <input type="number" name="principal" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Annual Interest Rate (%)</label>
                    <input type="number" name="rate" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Tenure (Years)</label>
                    <input type="number" name="tenure" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-loan-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcLoan
    },
    'calc-tax': {
        title: 'Tax Calculator',
        content: `
            <h2>Tax Calculator</h2>
            <form id="calc-tax-form" class="calculator-form">
                <div class="form-group">
                    <label>Total Income</label>
                    <input type="number" name="income" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Tax Rate (%)</label>
                    <input type="number" name="rate" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-tax-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcTax
    },
    'calc-breakeven': {
        title: 'Break-Even Calculator',
        content: `
            <h2>Break-Even Calculator</h2>
            <form id="calc-breakeven-form" class="calculator-form">
                <div class="form-group">
                    <label>Fixed Costs</label>
                    <input type="number" name="fixed" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Variable Cost per Unit</label>
                    <input type="number" name="variable" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Selling Price per Unit</label>
                    <input type="number" name="price" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-breakeven-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcBreakeven
    },
    'calc-cashflow': {
        title: 'Cash Flow Calculator',
        content: `
            <h2>Cash Flow Calculator</h2>
            <form id="calc-cashflow-form" class="calculator-form">
                <div class="form-group">
                    <label>Total Cash Inflow</label>
                    <input type="number" name="inflow" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Total Cash Outflow</label>
                    <input type="number" name="outflow" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-cashflow-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcCashflow
    },
    'calc-pricing': {
        title: 'Pricing / Margin Calculator',
        content: `
            <h2>Pricing / Margin Calculator</h2>
            <form id="calc-pricing-form" class="calculator-form">
                <div class="form-group">
                    <label>Cost per Unit</label>
                    <input type="number" name="cost" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Desired Margin (%)</label>
                    <input type="number" name="margin" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-pricing-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcPricing
    },
    'calc-cost': {
        title: 'Cost Analysis Calculator',
        content: `
            <h2>Cost Analysis Calculator</h2>
            <form id="calc-cost-form" class="calculator-form">
                <div class="form-group">
                    <label>Material Cost</label>
                    <input type="number" name="material" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Labor Cost</label>
                    <input type="number" name="labor" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Overhead Cost</label>
                    <input type="number" name="overhead" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-cost-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcCost
    },
    'calc-tvm': {
        title: 'TVM Calculator (Compound Interest)',
        content: `
            <h2>Time Value of Money (Future Value)</h2>
            <form id="calc-tvm-form" class="calculator-form">
                <div class="form-group">
                    <label>Present Value (PV)</label>
                    <input type="number" name="pv" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Annual Interest Rate (%)</label>
                    <input type="number" name="rate" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Time Period (Years)</label>
                    <input type="number" name="time" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-tvm-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcTvm
    },
    'calc-payroll': {
        title: 'Payroll Calculator',
        content: `
            <h2>Payroll Calculator</h2>
            <form id="calc-payroll-form" class="calculator-form">
                <div class="form-group">
                    <label>Gross Pay</label>
                    <input type="number" name="gross" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Total Deductions</label>
                    <input type="number" name="deductions" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-payroll-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcPayroll
    },
    'calc-logistics': {
        title: 'Logistics Cost Calculator',
        content: `
            <h2>Logistics Cost Calculator</h2>
            <form id="calc-logistics-form" class="calculator-form">
                <div class="form-group">
                    <label>Distance</label>
                    <input type="number" name="distance" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Weight</label>
                    <input type="number" name="weight" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Rate per Dist*Weight</label>
                    <input type="number" name="rate" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-logistics-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcLogistics
    },
    'calc-retail': {
        title: 'Retail Markup Calculator',
        content: `
            <h2>Retail Markup Calculator</h2>
            <form id="calc-retail-form" class="calculator-form">
                <div class="form-group">
                    <label>Cost Price</label>
                    <input type="number" name="cost" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Markup Percentage (%)</label>
                    <input type="number" name="markup" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-retail-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcRetail
    },
    'calc-workingcapital': {
        title: 'Working Capital Calculator',
        content: `
            <h2>Working Capital Calculator</h2>
            <form id="calc-workingcapital-form" class="calculator-form">
                <div class="form-group">
                    <label>Current Assets</label>
                    <input type="number" name="assets" class="form-control" required step="any">
                </div>
                <div class="form-group">
                    <label>Current Liabilities</label>
                    <input type="number" name="liabilities" class="form-control" required step="any">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Calculate</button>
            </form>
            <div id="calc-workingcapital-result" class="calculator-result" style="display:none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
        `,
        init: initCalcWorkingcapital
    },
    'biz-profile': {
        title: 'Company Profile',
        content: `
            <h2>Company Profile</h2>
            <form id="biz-profile-form" class="calculator-form" style="max-width: 600px;">
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Tagline / Slogan</label>
                    <input type="text" name="tagline" class="form-control">
                </div>
                <div class="form-group">
                    <label>Address (Multiline)</label>
                    <textarea name="address" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" name="phone" class="form-control">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control">
                </div>
                <div class="form-group">
                    <label>Website</label>
                    <input type="text" name="website" class="form-control">
                </div>
                <div class="form-group">
                    <label>Tax / GST ID</label>
                    <input type="text" name="taxid" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Save Profile</button>
            </form>
            <div id="biz-profile-result" class="calculator-result" style="display:none; margin-top: 20px;"></div>
        `,
        init: initBizProfile
    },
    'biz-clients': {
        title: 'Client Management',
        content: `
            <h2>Client Management</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Add New Client</h3>
                    <form id="biz-client-form" class="calculator-form" style="margin:0;">
                        <div class="form-group">
                            <label>Client Name</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" name="phone" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <textarea name="address" class="form-control" rows="2"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Add Client</button>
                    </form>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Existing Clients</h3>
                    <table id="biz-client-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                        <thead>
                            <tr style="background: #f0f0f0; text-align: left;">
                                <th style="padding: 10px;">Name</th>
                                <th style="padding: 10px;">Email</th>
                                <th style="padding: 10px;">Phone</th>
                                <th style="padding: 10px;">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `,
        init: initBizClients
    },
    'biz-invoice': {
        title: 'Invoice Generator',
        content: `
            <h2>Invoice Generator</h2>
            <div class="invoice-controls" style="background:#f8f9fa; padding:15px; margin-bottom:20px; border-radius:5px; border:1px solid #ddd; display:flex; gap:15px; flex-wrap:wrap; align-items:flex-end;">
                <div class="form-group" style="margin-bottom:0; flex:1;">
                    <label>Select Client</label>
                    <select id="inv-client-select" class="form-control"></select>
                </div>
                <div class="form-group" style="margin-bottom:0; width:150px;">
                    <label>Invoice Date</label>
                    <input type="date" id="inv-date-input" class="form-control">
                </div>
                <div class="form-group" style="margin-bottom:0; width:100px;">
                    <label>Tax Rate (%)</label>
                    <input type="number" id="inv-tax-rate" class="form-control" value="0">
                </div>
                <button id="inv-generate-btn" class="btn btn-primary"><i class="fa-solid fa-file-pdf"></i> Download PDF</button>
            </div>

            <!-- Invoice Preview Area -->
            <div id="invoice-preview-area" style="background:white; padding:40px; border:1px solid #ddd; box-shadow:0 0 10px rgba(0,0,0,0.05); max-width:800px; margin:0 auto;">
                <div style="display:flex; justify-content:space-between; margin-bottom:40px;">
                    <div>
                        <h1 style="margin:0; color:#333;">INVOICE</h1>
                        <p style="color:#777;"># <span contenteditable="true">INV-001</span></p>
                    </div>
                    <div style="text-align:right;">
                        <h3 id="inv-company-name" style="margin:0;">Your Company</h3>
                        <p id="inv-company-address" style="white-space:pre-line; color:#555;">Address</p>
                    </div>
                </div>
                
                <div style="margin-bottom:40px; display:flex; justify-content:space-between;">
                    <div>
                        <p><strong>Bill To:</strong></p>
                        <h4 id="inv-client-name" style="margin:5px 0;">Client Name</h4>
                        <p id="inv-client-address" style="white-space:pre-line; color:#555;">Client Address</p>
                    </div>
                    <div style="text-align:right;">
                        <p><strong>Date:</strong> <span id="inv-date-display">2023-01-01</span></p>
                        <p><strong>Due Date:</strong> <span contenteditable="true">2023-01-15</span></p>
                    </div>
                </div>
                
                <table id="inv-items-table" style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                    <thead>
                        <tr style="background:#f0f0f0; border-bottom:2px solid #ddd;">
                            <th style="padding:10px; text-align:left;">Description</th>
                            <th style="padding:10px; width:80px;">Qty</th>
                            <th style="padding:10px; width:100px;">Rate</th>
                            <th style="padding:10px; text-align:right;">Total</th>
                            <th style="padding:10px; width:40px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Rows added by JS -->
                    </tbody>
                </table>
                
                <button id="inv-add-item" class="btn btn-secondary btn-sm" style="margin-bottom:20px;">+ Add Item</button>

                <div style="display:flex; justify-content:flex-end;">
                    <div style="width:250px;">
                        <div style="display:flex; justify-content:space-between; padding:5px 0;">
                            <span>Subtotal:</span>
                            <span id="inv-subtotal">0.00</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; padding:5px 0;">
                            <span>Tax (<span id="inv-tax-amount-display"></span>):</span>
                            <span id="inv-tax-amount">0.00</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; padding:10px 0; border-top:2px solid #ddd; font-weight:bold; font-size:1.2em;">
                            <span>Total:</span>
                            <span id="inv-grand-total">0.00</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top:50px; text-align:center; font-size:0.9em; color:#777;">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        `,
        init: initBizInvoice
    },
    'biz-expense': {
        title: 'Expense Tracker',
        content: `
            <h2>Expense Tracker</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Add Expense</h3>
                    <form id="biz-expense-form" class="calculator-form" style="margin:0;">
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" name="date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category" class="form-control" required>
                                <option value="Office">Office Supplies</option>
                                <option value="Travel">Travel</option>
                                <option value="Salary">Salary</option>
                                <option value="Rent">Rent</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" name="amount" class="form-control" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" name="description" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Save Expense</button>
                    </form>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Recent Expenses</h3>
                    <div style="max-height: 400px; overflow-y: auto;">
                        <table id="biz-expense-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                            <thead>
                                <tr style="background: #f0f0f0; text-align: left;">
                                    <th style="padding: 10px;">Date</th>
                                    <th style="padding: 10px;">Category</th>
                                    <th style="padding: 10px;">Desc</th>
                                    <th style="padding: 10px; text-align:right;">Amount</th>
                                    <th style="padding: 10px;">Action</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                             <tfoot>
                                <tr style="background: #f8f9fa; font-weight: bold;">
                                    <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
                                    <td id="exp-total" style="padding: 10px; text-align: right;">0.00</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        `,
        init: initBizExpense
    },
    'biz-payments': {
        title: 'Payments Manager',
        content: `
            <h2>Payments Manager</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Record Payment</h3>
                    <form id="biz-payment-form" class="calculator-form" style="margin:0;">
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" name="date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                             <select name="type" class="form-control" required>
                                <option value="incoming">Incoming (Revenue)</option>
                                <option value="outgoing">Outgoing (Cost)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" name="amount" class="form-control" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Reference (Invoice # / Desc)</label>
                            <input type="text" name="reference" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Record Transaction</button>
                    </form>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Transaction History</h3>
                    <div style="max-height: 400px; overflow-y: auto;">
                        <table id="biz-payment-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                            <thead>
                                <tr style="background: #f0f0f0; text-align: left;">
                                    <th style="padding: 10px;">Date</th>
                                    <th style="padding: 10px;">Type</th>
                                    <th style="padding: 10px;">Ref</th>
                                    <th style="padding: 10px; text-align:right;">Amount</th>
                                    <th style="padding: 10px;">Action</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        init: initBizPayments
    },
    'biz-revenue': {
        title: 'Revenue Reports',
        content: `
            <h2>Revenue & Financial Reports</h2>
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div class="card" style="flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid green;">
                    <h3 style="margin: 0 0 10px; color: #555;">Total Revenue</h3>
                    <p style="font-size: 2em; font-weight: bold; color: #333;" id="rep-revenue">0.00</p>
                    <p style="font-size: 0.8em; color: #777;">(Incoming Payments)</p>
                </div>
                <div class="card" style="flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid #d9534f;">
                    <h3 style="margin: 0 0 10px; color: #555;">Total Expenses</h3>
                    <p style="font-size: 2em; font-weight: bold; color: #333;" id="rep-expenses">0.00</p>
                    <p style="font-size: 0.8em; color: #777;">(Recorded Expenses)</p>
                </div>
                <div class="card" style="flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid #0004d7;">
                    <h3 style="margin: 0 0 10px; color: #555;">Net Profit</h3>
                    <p style="font-size: 2em; font-weight: bold; color: #333;" id="rep-profit">0.00</p>
                    <p style="font-size: 0.8em; color: #777;">(Revenue - Expenses)</p>
                </div>
            </div>
            
            <div style="text-align: right; padding: 10px;">
                 <button class="btn btn-secondary" onclick="initBizRevenue()"><i class="fa-solid fa-sync"></i> Refresh Data</button>
            </div>
        `,
        init: initBizRevenue
    },
    'biz-vendor': {
        title: 'Vendor Management',
        content: `
            <h2>Vendor Management</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Add Vendor</h3>
                    <form id="biz-vendor-form" class="calculator-form" style="margin:0;">
                         <div class="form-group">
                            <label>Vendor Name</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Service / Product</label>
                            <input type="text" name="service" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Contact Info</label>
                            <input type="text" name="contact" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Add Vendor</button>
                    </form>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Vendor List</h3>
                    <table id="biz-vendor-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                        <thead>
                            <tr style="background: #f0f0f0; text-align: left;">
                                <th style="padding: 10px;">Name</th>
                                <th style="padding: 10px;">Service</th>
                                <th style="padding: 10px;">Contact</th>
                                <th style="padding: 10px;">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `,
        init: initBizVendor
    },
    'biz-team': {
        title: 'Team Management',
        content: `
            <h2>Team Management</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Add Employee</h3>
                    <form id="biz-team-form" class="calculator-form" style="margin:0;">
                         <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Role</label>
                            <input type="text" name="role" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Add Member</button>
                    </form>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Employee List</h3>
                    <table id="biz-team-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                        <thead>
                            <tr style="background: #f0f0f0; text-align: left;">
                                <th style="padding: 10px;">Name</th>
                                <th style="padding: 10px;">Role</th>
                                <th style="padding: 10px;">Email</th>
                                <th style="padding: 10px;">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `,
        init: initBizTeam
    },
    'biz-attendance': {
        title: 'Attendance System',
        content: `
            <h2>Attendance System</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Mark Attendance</h3>
                    <div class="calculator-form" style="margin:0;">
                         <div class="form-group">
                            <label>Date</label>
                            <input type="date" id="att-date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Employee</label>
                            <select id="att-employee-select" class="form-control"></select>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select id="att-status-select" class="form-control">
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Half Day">Half Day</option>
                                <option value="Leave">On Leave</option>
                            </select>
                        </div>
                        <button id="att-mark-btn" class="btn btn-primary" style="margin-top:10px;">Mark Attendance</button>
                    </div>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Recent Logs</h3>
                    <table id="att-logs-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                        <thead>
                            <tr style="background: #f0f0f0; text-align: left;">
                                <th style="padding: 10px;">Date</th>
                                <th style="padding: 10px;">Name</th>
                                <th style="padding: 10px;">Status</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `,
        init: initBizAttendance
    },
    'biz-leave': {
        title: 'Leave Management',
        content: `
            <h2>Leave Management</h2>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3>Request Leave</h3>
                    <form id="biz-leave-form" class="calculator-form" style="margin:0;">
                         <div class="form-group">
                            <label>Employee</label>
                            <select id="leave-employee-select" name="employeeId" class="form-control" required></select>
                        </div>
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="date" name="start" class="form-control" required>
                        </div>
                         <div class="form-group">
                            <label>End Date</label>
                            <input type="date" name="end" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Reason</label>
                            <input type="text" name="reason" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Submit Request</button>
                    </form>
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h3>Leave Requests</h3>
                    <table id="leave-list" class="table" style="width:100%; border-collapse: collapse; background: white;">
                        <thead>
                            <tr style="background: #f0f0f0; text-align: left;">
                                <th style="padding: 10px;">Name</th>
                                <th style="padding: 10px;">Date(s)</th>
                                <th style="padding: 10px;">Reason</th>
                                <th style="padding: 10px;">Status</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `,
        init: initBizLeave
    },
    'biz-dashboard': {
        title: 'Business Dashboard',
        content: `
            <h2>Business Dashboard</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="tool-list-item" style="cursor: default; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div style="font-size: 2.5em; margin-bottom: 10px;"><i class="fa-solid fa-money-bill-wave"></i></div>
                    <h3>Revenue</h3>
                    <p style="font-size: 1.5em; font-weight: bold;">$<span id="dash-revenue">0.00</span></p>
                </div>
                <div class="tool-list-item" style="cursor: default; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); color: #333;">
                    <div style="font-size: 2.5em; margin-bottom: 10px;"><i class="fa-solid fa-receipt"></i></div>
                    <h3>Expenses</h3>
                    <p style="font-size: 1.5em; font-weight: bold;">$<span id="dash-expense">0.00</span></p>
                </div>
                 <div class="tool-list-item" style="cursor: default; background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); color: white;">
                    <div style="font-size: 2.5em; margin-bottom: 10px;"><i class="fa-solid fa-piggy-bank"></i></div>
                    <h3>Net Profit</h3>
                    <p style="font-size: 1.5em; font-weight: bold;">$<span id="dash-profit">0.00</span></p>
                </div>
                 <div class="tool-list-item" style="cursor: default;">
                    <div style="font-size: 2.5em; margin-bottom: 10px; color: #555;"><i class="fa-solid fa-users"></i></div>
                    <h3 style="color: #333;">Team Size</h3>
                    <p style="font-size: 1.5em; font-weight: bold; color: #333;" id="dash-team">0</p>
                </div>
                <div class="tool-list-item" style="cursor: default;">
                    <div style="font-size: 2.5em; margin-bottom: 10px; color: #555;"><i class="fa-solid fa-handshake"></i></div>
                    <h3 style="color: #333;">Clients</h3>
                    <p style="font-size: 1.5em; font-weight: bold; color: #333;" id="dash-clients">0</p>
                </div>
                 <div class="tool-list-item" style="cursor: default;">
                    <div style="font-size: 2.5em; margin-bottom: 10px; color: #555;"><i class="fa-solid fa-clock-rotate-left"></i></div>
                    <h3 style="color: #333;">Pending Leaves</h3>
                    <p style="font-size: 1.5em; font-weight: bold; color: #333;" id="dash-leaves">0</p>
                </div>
            </div>
            <div style="text-align: right;">
                 <button class="btn btn-primary" onclick="initBizDashboard()"><i class="fa-solid fa-sync"></i> Refresh Dashboard</button>
            </div>
        `,
        init: initBizDashboard
    },
    'biz-analytics': {
        title: 'Business Analytics',
        content: `
            <h2>Business Analytics</h2>
            <div style="padding: 40px; text-align: center; color: #777;">
                <i class="fa-solid fa-chart-pie" style="font-size: 5em; margin-bottom: 20px; color: #ddd;"></i>
                <h3>Advanced Analytics</h3>
                <p>This module would typically contain charts (Bar, Line, Pie) for:</p>
                <ul style="list-style: none; padding: 0; margin-top: 20px;">
                    <li>Revenue vs Expenses over time</li>
                    <li>Expense Breakdown by Category</li>
                    <li>Employee Attendance Trends</li>
                </ul>
                <p style="margin-top: 20px;">For now, please use the <strong>Business Dashboard</strong> and <strong>Revenue Reports</strong> for insights.</p>
                <button class="btn btn-secondary" onclick="app.loadTool('biz-dashboard')" style="margin-top: 20px;">Go to Dashboard</button>
            </div>
        `,
        init: initBizAnalytics
    },
    'image-to-pdf': {
        title: 'Image to PDF',
        content: `
            <h2>Image to PDF</h2>
            <div class="upload-area" id="drop-zone">
                <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                <p class="upload-text">Drag & Drop images here</p>
                <p class="upload-subtext">or click to browse files</p>
                <input type="file" id="file-input" multiple accept="image/*" style="display: none">
            </div>
            <div class="preview-container" id="preview-container"></div>
            <div class="action-buttons">
                <button class="btn btn-secondary" id="clear-all">Clear All</button>
                <button class="btn btn-primary" id="convert-btn">Convert to PDF</button>
            </div>
        `,
        init: initImageToPdf
    },
    'compress-pdf': {
        title: 'Compress PDF',
        content: `
            <h2>Compress PDF</h2>
            <div class="upload-area" id="drop-zone-compress">
                <i class="fa-solid fa-file-pdf upload-icon"></i>
                <p class="upload-text">Drag & Drop PDF here</p>
                <p class="upload-subtext">or click to browse file</p>
                <input type="file" id="file-input-compress" accept="application/pdf" style="display: none">
            </div>
            <div id="compress-options" style="display:none; text-align: center; margin-bottom: 2rem;">
                <p id="selected-file-name" style="margin-bottom: 1rem; color: var(--text-primary);"></p>
                
                <div class="radio-group" style="margin-bottom: 1.5rem; display: flex; justify-content: center; gap: 1.5rem;">
                    <label class="radio-label" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" name="compression-type" value="specific" checked id="type-specific">
                        Specific Size (KB)
                    </label>
                    <label class="radio-label" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" name="compression-type" value="quality" id="type-quality">
                        Quality Level
                    </label>
                </div>

                <div id="specific-input-container" style="margin-bottom: 1rem;">
                    <label style="color: var(--text-secondary); margin-right: 0.5rem;">Target Size:</label>
                    <input type="number" id="target-kb" value="50" min="10" style="padding: 0.5rem; border-radius: 5px; width: 100px; background: white; color: var(--text-primary); border: 1px solid var(--border-color);">
                    <span style="color: var(--text-secondary);">KB</span>
                </div>

                <div id="quality-input-container" style="display: none; margin-bottom: 1rem;">
                    <ul class="option-select">
                        <li class="option-card" data-value="0.3">
                            <span class="option-title">Extreme Compression</span>
                            <span class="option-desc">Less quality (0.3)</span>
                        </li>
                        <li class="option-card selected" data-value="0.5">
                            <span class="option-title">Recommended</span>
                            <span class="option-desc">Good quality (0.5)</span>
                        </li>
                        <li class="option-card" data-value="0.8">
                            <span class="option-title">Low Compression</span>
                            <span class="option-desc">High quality (0.8)</span>
                        </li>
                    </ul>
                    <input type="hidden" id="compression-level" value="0.5">
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" id="compress-btn">Compress PDF</button>
                </div>
            </div>
            <div id="processing-status" style="display:none; text-align: center; margin-top: 1rem; color: var(--accent-blue);">
                Processing... <span id="progress-text"></span>
            </div>
        `,
        init: initCompressPdf
    },
    'image-compressor': {
        title: 'Image Compressor',
        content: `
            <h2>Image Compressor</h2>
            <div class="upload-area" id="drop-zone-img-comp">
                <i class="fa-solid fa-compress upload-icon"></i>
                <p class="upload-text">Drag & Drop Image here</p>
                <p class="upload-subtext">or click to browse file</p>
                <input type="file" id="file-input-img-comp" accept="image/*" style="display: none">
            </div>
            <div id="img-comp-options" style="display:none; text-align: center; margin-bottom: 2rem;">
                <p id="selected-img-name" style="margin-bottom: 1rem; color: var(--text-primary);"></p>
                
                <div class="radio-group" style="margin-bottom: 1.5rem; display: flex; justify-content: center; gap: 1.5rem;">
                    <label class="radio-label" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" name="ic-type" value="specific" checked id="ic-specific">
                        Specific Size (KB)
                    </label>
                    <label class="radio-label" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" name="ic-type" value="quality" id="ic-quality">
                        Quality
                    </label>
                </div>

                <div id="ic-specific-container" style="margin-bottom: 1rem;">
                    <label style="color: var(--text-secondary); margin-right: 0.5rem;">Target Size:</label>
                    <input type="number" id="ic-target-kb" value="50" min="10" style="padding: 0.5rem; border-radius: 5px; width: 100px; background: white; color: var(--text-primary); border: 1px solid var(--border-color);">
                    <span style="color: var(--text-secondary);">KB</span>
                </div>

                <div id="ic-quality-container" style="display: none; margin-bottom: 1rem;">
                    <label style="color: var(--text-secondary); margin-right: 0.5rem;">Quality:</label>
                    <input type="range" id="ic-quality-slider" min="1" max="100" value="80" style="vertical-align: middle;">
                    <span id="ic-quality-val" style="color: var(--text-primary);">80%</span>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" id="img-comp-btn">Compress Image</button>
                </div>
            </div>
             <div id="ic-status" style="display:none; text-align: center; margin-top: 1rem; color: var(--accent-blue);">
                Processing...
            </div>
        `,
        init: initImageCompressor
    },
    'pdf-to-image': {
        title: 'PDF to Image',
        content: `
            <h2>PDF to Image</h2>
            <div class="upload-area" id="drop-zone-pdf2img">
                <i class="fa-solid fa-file-image upload-icon"></i>
                <p class="upload-text">Drag & Drop PDF here</p>
                <p class="upload-subtext">or click to browse file</p>
                <input type="file" id="file-input-pdf2img" accept="application/pdf" style="display: none">
            </div>
            <div id="pdf2img-options" style="display:none; text-align: center; margin-bottom: 2rem;">
                <p id="selected-file-name-pdf2img" style="margin-bottom: 1rem; color: var(--text-primary);"></p>
                <label style="color: var(--text-secondary); margin-right: 1rem;">Format:</label>
                <select id="image-format" style="padding: 0.5rem; border-radius: 5px; background: white; color: var(--text-primary); border: 1px solid var(--border-color);">
                    <option value="jpeg">JPG</option>
                    <option value="png">PNG</option>
                </select>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" id="pdf2img-btn" disabled>Convert to Images</button>
            </div>
            <div id="processing-status-pdf2img" style="display:none; text-align: center; margin-top: 1rem; color: var(--accent-blue);">
                Processing... <span id="progress-text-pdf2img"></span>
            </div>
        `,
        init: initPdfToImage
    },
    'merge-pdf': {
        title: 'Merge PDF',
        content: `
                <h2>Merge PDF</h2>
            <div class="upload-area" id="drop-zone-merge">
                <i class="fa-solid fa-object-group upload-icon"></i>
                <p class="upload-text">Drag & Drop PDFs here</p>
                <p class="upload-subtext">or click to browse files</p>
                <input type="file" id="file-input-merge" multiple accept="application/pdf" style="display: none">
            </div>
            <div id="merge-list" style="margin-bottom: 2rem; display:none;">
                <h3>Selected Files:</h3>
                <ul id="merge-file-list" style="list-style: none; padding: 0;"></ul>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" id="merge-btn" disabled>Merge PDFs</button>
            </div>
        `,
        init: initMergePdf
    },
    'split-pdf': {
        title: 'Split PDF',
        content: `
            <h2>Split PDF</h2>
            <div class="upload-area" id="drop-zone-split">
                <i class="fa-solid fa-scissors upload-icon"></i>
                <p class="upload-text">Drag & Drop PDF here</p>
                <p class="upload-subtext">or click to browse file</p>
                <input type="file" id="file-input-split" accept="application/pdf" style="display: none">
            </div>
                <div id="split-options" style="display:none; text-align: center; margin-bottom: 2rem;">
                <p id="split-file-name" style="margin-bottom: 1rem; color: var(--text-primary);"></p>
                <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Page Ranges (e.g. 1-3, 5):</label>
                <input type="text" id="split-range" placeholder="e.g. 1-2, 5" style="padding: 0.8rem; border-radius: 5px; width: 100%; max-width: 300px; background: white; color: var(--text-primary); border: 1px solid var(--border-color);">
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" id="split-btn" disabled>Split PDF</button>
            </div>
            `,
        init: initSplitPdf
    },
    'image-editor': {
        title: 'Image Editor',
        content: `
                <h2>Image Editor</h2>
                <div class="upload-area" id="drop-zone-editor">
                    <i class="fa-solid fa-crop-simple upload-icon"></i>
                    <p class="upload-text">Drag & Drop Image here</p>
                    <p class="upload-subtext">or click to browse file</p>
                    <input type="file" id="file-input-editor" accept="image/*" style="display: none">
                </div>
                
                <div id="editor-container" style="display:none; max-height: 500px; margin-bottom: 2rem;">
                    <img id="editor-image" style="max-width: 100%; max-height: 500px; display: block;">
                </div>

                <div id="editor-controls" style="display:none; text-align: center; margin-bottom: 2rem;">
                     <div style="margin-bottom: 1rem; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-secondary" id="rotate-left"><i class="fa-solid fa-rotate-left"></i></button>
                        <button class="btn btn-secondary" id="rotate-right"><i class="fa-solid fa-rotate-right"></i></button>
                        <button class="btn btn-secondary" id="scale-x"><i class="fa-solid fa-arrows-left-right"></i> Flip H</button>
                        <button class="btn btn-secondary" id="scale-y"><i class="fa-solid fa-arrows-up-down"></i> Flip V</button>
                     </div>
                     <div style="margin-bottom: 1rem;">
                        <button class="btn btn-primary" id="btn-crop">Apply Crop</button>
                     </div>
                     <div style="margin-bottom: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <label>Resize Width (px): <input type="number" id="resize-w" style="width: 80px; padding: 5px;"></label>
                        <label>Quality (0-1): <input type="number" id="compress-q" value="0.8" step="0.1" max="1" min="0.1" style="width: 60px; padding: 5px;"></label>
                     </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" id="download-editor-btn" disabled>Download Image</button>
                </div>
            `,
        init: initImageEditor
    },
    'sign-pdf': {
        title: 'Sign PDF',
        content: `
                <h2>Sign PDF</h2>
                <div class="upload-area" id="drop-zone-sign">
                    <i class="fa-solid fa-signature upload-icon"></i>
                    <p class="upload-text">Drag & Drop PDF here</p>
                    <input type="file" id="file-input-sign" accept="application/pdf" style="display: none">
                </div>
                <div id="sign-container" style="display:none;">
                    <div style="margin-bottom:1rem; display:flex; gap:1rem; align-items:center;">
                        <button class="btn btn-secondary" id="prev-page"><i class="fa-solid fa-arrow-left"></i></button>
                        <span id="page-num">Page 1</span>
                        <button class="btn btn-secondary" id="next-page"><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                    <div style="position:relative; border:1px solid #ccc; overflow:auto; max-height:600px;">
                        <canvas id="pdf-render-canvas" style="display:block;"></canvas>
                        <canvas id="drawing-canvas" style="position:absolute; top:0; left:0; cursor:crosshair;"></canvas>
                    </div>
                     <div style="margin-top:1rem; display:flex; gap:1rem; justify-content:center;">
                        <button class="btn btn-secondary" id="clear-signature">Clear Signature</button>
                        <button class="btn btn-primary" id="save-signature">Download Signed PDF</button>
                     </div>
                </div>
            `,
        init: () => initSignAnnotate('sign')
    },
    'annotate-pdf': {
        title: 'Annotate PDF',
        content: `
                <h2>Annotate PDF</h2>
                <div class="upload-area" id="drop-zone-sign">
                    <i class="fa-solid fa-pen-to-square upload-icon"></i>
                    <p class="upload-text">Drag & Drop PDF here</p>
                    <input type="file" id="file-input-sign" accept="application/pdf" style="display: none">
                </div>
                <div id="sign-container" style="display:none;">
                    <div style="margin-bottom:1rem; display:flex; gap:1rem; align-items:center;">
                        <button class="btn btn-secondary" id="prev-page"><i class="fa-solid fa-arrow-left"></i></button>
                        <span id="page-num">Page 1</span>
                        <button class="btn btn-secondary" id="next-page"><i class="fa-solid fa-arrow-right"></i></button>
                        <input type="color" id="pen-color" value="#ff0000">
                    </div>
                    <div style="position:relative; border:1px solid #ccc; overflow:auto; max-height:600px;">
                        <canvas id="pdf-render-canvas" style="display:block;"></canvas>
                        <canvas id="drawing-canvas" style="position:absolute; top:0; left:0; cursor:crosshair;"></canvas>
                    </div>
                     <div style="margin-top:1rem; display:flex; gap:1rem; justify-content:center;">
                        <button class="btn btn-secondary" id="clear-signature">Clear Annotations</button>
                        <button class="btn btn-primary" id="save-signature">Download Annotated PDF</button>
                     </div>
                </div>
            `,
        init: () => initSignAnnotate('annotate')
    },
    'ocr-pdf': {
        title: 'OCR Tool',
        content: `
                <h2>OCR PDF/Image</h2>
                <div class="upload-area" id="drop-zone-ocr">
                    <i class="fa-solid fa-eye upload-icon"></i>
                    <p class="upload-text">Drag & Drop Image or PDF</p>
                    <input type="file" id="file-input-ocr" accept="image/*,application/pdf" style="display: none">
                </div>
                <div id="ocr-result" style="display:none;">
                    <h3>Extracted Text:</h3>
                    <textarea id="ocr-text-output" style="width:100%; height:300px; background:#1e293b; color:#fff; padding:1rem; margin-bottom:1rem;"></textarea>
                    <button class="btn btn-secondary" id="copy-text">Copy Text</button>
                </div>
                <div id="processing-status-ocr" style="display:none; text-align: center; margin-top: 1rem; color: var(--accent-blue);">
                    Scanning... <span id="progress-text-ocr"></span>
                </div>
            `,
        init: initOCR
    },
    'remove-pages': {
        title: 'Remove Pages',
        content: `<h2>Remove Pages</h2>
                  <div class="upload-area" id="drop-zone-remove">
                      <i class="fa-solid fa-trash-can upload-icon"></i>
                      <p>Drag & Drop PDF here</p>
                      <input type="file" id="file-input-remove" accept="application/pdf" style="display:none">
                  </div>
                  <div id="remove-options" style="display:none; text-align:center;">
                      <p id="remove-file-name" style="margin-bottom:1rem;"></p>
                      <label>Pages to Remove (e.g. 1, 3-5): <input type="text" id="remove-pages-input" placeholder="1, 3-5" style="padding:0.5rem; width:200px; color:black;"></label>
                      <br><br>
                      <button class="btn btn-primary" id="remove-btn">Remove Pages</button>
                  </div>`,
        init: initRemovePages
    },
    'extract-pages': {
        title: 'Extract Pages',
        content: `<h2>Extract Pages</h2>
                  <div class="upload-area" id="drop-zone-extract">
                      <i class="fa-solid fa-file-export upload-icon"></i>
                      <p>Drag & Drop PDF here</p>
                      <input type="file" id="file-input-extract" accept="application/pdf" style="display:none">
                  </div>
                  <div id="extract-options" style="display:none; text-align:center;">
                      <p id="extract-file-name" style="margin-bottom:1rem;"></p>
                      <label>Pages to Extract (e.g. 1, 3-5): <input type="text" id="extract-pages-input" placeholder="1, 3-5" style="padding:0.5rem; width:200px; color:black;"></label>
                      <br><br>
                      <button class="btn btn-primary" id="extract-btn">Extract Pages</button>
                  </div>`,
        init: initExtractPages
    },
    'organize-pdf': {
        title: 'Organize PDF',
        content: `<h2>Organize PDF</h2>
                  <div class="upload-area" id="drop-zone-organize">
                      <i class="fa-solid fa-sort upload-icon"></i>
                      <p>Drag & Drop PDF here to Reorder/Rotate</p>
                      <input type="file" id="file-input-organize" accept="application/pdf" style="display:none">
                  </div>
                  <div id="organize-container" style="display:none; display:flex; flex-wrap:wrap; gap:10px; justify-content:center; max-height:500px; overflow-y:auto; padding:10px;"></div>
                  <div class="action-buttons" style="display:none; margin-top:1rem;" id="organize-actions">
                      <button class="btn btn-primary" id="save-organize-btn">Save PDF</button>
                  </div>`,
        init: initOrganizePdf
    },
    'scan-pdf': {
        title: 'Scan to PDF',
        content: `<h2>Scan to PDF</h2><p>Use your camera to capture documents.</p>
                  <div id="camera-container" style="display:none; text-align:center;">
                     <video id="camera-video" autoplay style="width:100%; max-width:400px; border:2px solid #333; margin-bottom:10px;"></video>
                     <br>
                     <button class="btn btn-primary" id="capture-btn">Capture Page</button>
                     <canvas id="camera-canvas" style="display:none;"></canvas>
                  </div>
                  <div class="action-buttons" id="scan-start-area">
                      <button class="btn btn-secondary" id="start-camera-btn">Start Camera</button>
                  </div>
                  <div id="scan-previews" style="margin-top:1rem; display:flex; gap:10px; flex-wrap:wrap; justify-content:center;"></div>
                  <div style="margin-top:1rem; text-align:center;">
                    <button class="btn btn-primary" id="save-scan-btn" disabled>Save as PDF</button>
                  </div>`,
        init: initScanPdf
    },
    'word-to-pdf': {
        title: 'Word to PDF',
        content: `<h2>Word to PDF</h2>
                  <div class="upload-area" id="drop-zone-word">
                      <i class="fa-solid fa-file-word upload-icon"></i>
                      <p>Drag & Drop Word (.docx) here</p>
                      <input type="file" id="file-input-word" accept=".docx" style="display:none">
                  </div>
                  <div id="word-status" style="margin-top:1rem; text-align:center;"></div>
                  <div id="word-preview" style="background:white; color:black; padding:2rem; max-height:400px; overflow:auto; margin:1rem 0; display:none;"></div>
                   <div style="text-align:center;"><button class="btn btn-primary" id="word-download-btn" disabled>Download PDF</button></div>`,
        init: initWordToPdf
    },
    'excel-to-pdf': {
        title: 'Excel to PDF',
        content: `<h2>Excel to PDF</h2>
                  <div class="upload-area" id="drop-zone-excel">
                      <i class="fa-solid fa-file-excel upload-icon"></i>
                      <p>Drag & Drop Excel (.xlsx) here</p>
                      <input type="file" id="file-input-excel" accept=".xlsx" style="display:none">
                  </div>
                  <div id="excel-status" style="margin-top:1rem; text-align:center;"></div>
                  <div id="excel-preview" style="background:white; color:black; padding:1rem; max-height:400px; overflow:auto; margin:1rem 0; display:none;"></div>
                  <div style="text-align:center;"><button class="btn btn-primary" id="excel-download-btn" disabled>Download PDF</button></div>`,
        init: initExcelToPdf
    },
    'html-to-pdf': {
        title: 'HTML to PDF',
        content: `<h2>HTML to PDF</h2>
                  <div class="upload-area" id="drop-zone-html">
                      <i class="fa-solid fa-code upload-icon"></i>
                      <p>Drag & Drop HTML file here</p>
                      <input type="file" id="file-input-html" accept=".html,.htm" style="display:none">
                  </div>
                  <div style="text-align:center; margin-top:1rem;">
                      <button class="btn btn-secondary" onclick="document.getElementById('html-text-input-area').style.display='block'">Or Paste Code</button>
                  </div>
                  <div id="html-text-input-area" style="display:none; margin-top:1rem;">
                      <textarea id="html-code-input" style="width:100%; height:200px; background:#222; color:#eee; padding:1rem;" placeholder="<h1>Hello</h1>"></textarea>
                      <br>
                      <button class="btn btn-primary" id="convert-html-code-btn" style="margin-top:1rem;">Convert Code</button>
                  </div>`,
        init: initHtmlToPdf
    },
    'repair-pdf': {
        title: 'Repair PDF',
        content: `<h2>Repair PDF</h2><p>Attempts to fix basic structure issues by regenerating the PDF.</p>
                  <div class="upload-area" id="drop-zone-repair">
                      <i class="fa-solid fa-hammer upload-icon"></i>
                      <p>Drag & Drop PDF to Repair</p>
                      <input type="file" id="file-input-repair" accept="application/pdf" style="display:none">
                  </div>
                  <div id="repair-status" style="text-align:center; margin-top:1rem;"></div>`,
        init: initRepairPdf
    },
    'rotate-pdf': {
        title: 'Rotate PDF',
        content: `<h2>Rotate PDF</h2>
                  <div class="upload-area" id="drop-zone-rotate">
                       <i class="fa-solid fa-rotate-right upload-icon"></i>
                      <p>Drag & Drop PDF</p>
                      <input type="file" id="file-input-rotate" accept="application/pdf" style="display:none">
                  </div>
                  <div id="rotate-controls" style="display:none; text-align:center;">
                    <p id="rotate-filename" style="margin-bottom:1rem;"></p>
                    <div style="margin-bottom:1rem;">
                        <button class="btn btn-secondary" id="rotate-cw">Rotate CW 90°</button>
                        <button class="btn btn-secondary" id="rotate-ccw">Rotate CCW 90°</button>
                    </div>
                    <button class="btn btn-primary" id="save-rotate-btn">Save Request</button>
                  </div>`,
        init: initRotatePdf
    },
    'protect-pdf': {
        title: 'Protect PDF',
        content: `<h2>Protect PDF</h2>
                  <div class="upload-area" id="drop-zone-protect">
                      <i class="fa-solid fa-lock upload-icon"></i>
                      <p>Drag & Drop PDF</p>
                      <input type="file" id="file-input-protect" accept="application/pdf" style="display:none">
                  </div>
                  <div id="protect-controls" style="display:none; text-align:center;">
                    <p id="protect-filename" style="margin-bottom:1rem;"></p>
                    <input type="password" id="protect-password" placeholder="Enter Password" style="padding:0.5rem; width:250px; color:black;">
                    <br><br>
                    <button class="btn btn-primary" id="apply-protect-btn">Encrypt & Save</button>
                  </div>`,
        init: initProtectPdf
    },
    'unlock-pdf': {
        title: 'Unlock PDF',
        content: `<h2>Unlock PDF</h2>
                  <div class="upload-area" id="drop-zone-unlock">
                      <i class="fa-solid fa-unlock upload-icon"></i>
                      <p>Drag & Drop PDF</p>
                      <input type="file" id="file-input-unlock" accept="application/pdf" style="display:none">
                  </div>
                  <div id="unlock-controls" style="display:none; text-align:center;">
                    <p id="unlock-filename" style="margin-bottom:1rem;"></p>
                    <input type="password" id="unlock-password" placeholder="Enter Password" style="padding:0.5rem; width:250px; color:black;">
                    <br><br>
                    <button class="btn btn-primary" id="apply-unlock-btn">Decrypt & Save</button>
                  </div>`,
        init: initUnlockPdf
    },
    'add-page-numbers': {
        title: 'Page Numbers',
        content: `<h2>Add Page Numbers</h2>
                  <div class="upload-area" id="drop-zone-pagenum">
                       <i class="fa-solid fa-list-ol upload-icon"></i>
                       <p>Drag & Drop PDF</p>
                       <input type="file" id="file-input-pagenum" accept="application/pdf" style="display:none">
                  </div>
                  <div id="pagenum-controls" style="display:none; text-align:center;">
                       <p id="pagenum-filename" style="margin-bottom:1rem;"></p>
                       <button class="btn btn-primary" id="apply-pagenum-btn">Add Numbers</button>
                  </div>`,
        init: initPageNumbers
    },
    'watermark-pdf': {
        title: 'Watermark',
        content: `<h2>Add Watermark</h2>
                  <div class="upload-area" id="drop-zone-watermark">
                      <i class="fa-brands fa-markdown upload-icon"></i>
                      <p>Drag & Drop PDF</p>
                      <input type="file" id="file-input-watermark" accept="application/pdf" style="display:none">
                  </div>
                  <div id="watermark-controls" style="display:none; text-align:center;">
                      <p id="watermark-filename" style="margin-bottom:1rem;"></p>
                      <input type="text" id="watermark-text" placeholder="Watermark Text" style="padding:0.5rem; width:250px; color:black;">
                      <br><br>
                      <button class="btn btn-primary" id="apply-watermark-btn">Apply Watermark</button>
                  </div>`,
        init: initWatermarkPdf
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// ==========================================
// Tool Implementations (Same logic as before)
// ==========================================

function initImageToPdf() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-all');
    let images = [];

    // Click to Open File Dialog
    dropZone.addEventListener('click', () => fileInput.click());

    // File Input Change
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgObj = {
                        file: file,
                        src: e.target.result,
                        id: Date.now() + Math.random()
                    };
                    images.push(imgObj);
                    renderPreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function renderPreview() {
        previewContainer.innerHTML = '';
        images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${img.src}" alt="preview">
                <button class="remove-btn" onclick="removeImage(${index})">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            // Bind remove function (dirty hack for simplicity, better to use event delegation)
            div.querySelector('.remove-btn').onclick = (e) => {
                e.stopPropagation();
                images.splice(index, 1);
                renderPreview();
            };
            previewContainer.appendChild(div);
        });
    }

    clearBtn.addEventListener('click', () => {
        images = [];
        renderPreview();
    });

    convertBtn.addEventListener('click', async () => {
        if (images.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        const pdf = new jsPDF();

        for (let i = 0; i < images.length; i++) {
            const imgData = images[i].src;
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            if (i > 0) pdf.addPage();

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save("converted-images.pdf");
    });
}

function initCompressPdf() {
    const dropZone = document.getElementById('drop-zone-compress');
    const fileInput = document.getElementById('file-input-compress');
    const compressOptions = document.getElementById('compress-options');
    const selectedFileName = document.getElementById('selected-file-name');
    const compressBtn = document.getElementById('compress-btn');
    const processingStatus = document.getElementById('processing-status');
    const progressText = document.getElementById('progress-text');

    // New Inputs
    const radioSpecific = document.getElementById('type-specific');
    const radioQuality = document.getElementById('type-quality');
    const specificContainer = document.getElementById('specific-input-container');
    const qualityContainer = document.getElementById('quality-input-container');
    const targetKbInput = document.getElementById('target-kb');

    // Card logic inputs
    const qualityInput = document.getElementById('compression-level');
    const optionCards = qualityContainer.querySelectorAll('.option-card');

    let selectedFile = null;

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handlePdfFile(e.target.files[0]));
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handlePdfFile(e.dataTransfer.files[0]); });

    // Radio Toggle Logic
    function toggleInputs() {
        if (radioSpecific.checked) {
            specificContainer.style.display = 'block';
            qualityContainer.style.display = 'none';
        } else {
            specificContainer.style.display = 'none';
            qualityContainer.style.display = 'block';
        }
    }

    if (radioSpecific) {
        radioSpecific.addEventListener('change', toggleInputs);
        radioQuality.addEventListener('change', toggleInputs);
    }

    // Option Cards Logic
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            optionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            qualityInput.value = card.dataset.value;
        });
    });

    function handlePdfFile(file) {
        if (file && file.type === 'application/pdf') {
            selectedFile = file;
            selectedFileName.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            compressOptions.style.display = 'block';
            dropZone.style.display = 'none';
            compressBtn.disabled = false;
        } else {
            alert("Please select a valid PDF file.");
        }
    }

    compressBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        compressBtn.disabled = true;
        processingStatus.style.display = 'block';

        // Determine Quality
        let quality = 0.5;
        if (radioQuality.checked) {
            quality = parseFloat(qualityInput.value);
        } else {
            // Calculate quality based on target size vs original size
            const targetKb = parseFloat(targetKbInput.value);
            const originalKb = selectedFile.size / 1024;

            if (targetKb >= originalKb) {
                quality = 0.9;
            } else {
                let ratio = targetKb / originalKb;
                if (ratio < 0.1) ratio = 0.1;
                if (ratio > 1) ratio = 1.0;
                quality = ratio;
            }
        }

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            const pdf = new jsPDF();
            const totalPages = pdfDoc.numPages;

            for (let i = 1; i <= totalPages; i++) {
                progressText.textContent = `Page ${i} of ${totalPages}`;
                const page = await pdfDoc.getPage(i);

                let scale = 1.5;
                if (quality < 0.3) scale = 1.0;

                const viewport = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                const imgData = canvas.toDataURL('image/jpeg', quality);
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (i > 1) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`compressed-${selectedFile.name}`);
            progressText.textContent = "Done!";
            setTimeout(() => {
                processingStatus.style.display = 'none';
                compressBtn.disabled = false;
                compressOptions.style.display = 'none';
                dropZone.style.display = 'block';
                selectedFile = null;
            }, 2000);

        } catch (error) {
            console.error(error);
            alert("An error occurred during compression.");
            processingStatus.style.display = 'none';
            compressBtn.disabled = false;
        }
    });
}

function initPdfToImage() {
    const dropZone = document.getElementById('drop-zone-pdf2img');
    const fileInput = document.getElementById('file-input-pdf2img');
    const optionsDiv = document.getElementById('pdf2img-options');
    const fileNameDisplay = document.getElementById('selected-file-name-pdf2img');
    const convertBtn = document.getElementById('pdf2img-btn');
    const statusDiv = document.getElementById('processing-status-pdf2img');
    const statusText = document.getElementById('progress-text-pdf2img');

    let selectedFile = null;

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    function handleFile(file) {
        if (file && file.type === 'application/pdf') {
            selectedFile = file;
            fileNameDisplay.textContent = `Selected: ${file.name}`;
            optionsDiv.style.display = 'block';
            dropZone.style.display = 'none';
            convertBtn.disabled = false;
        } else {
            alert("Please select a valid PDF file.");
        }
    }

    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const format = document.getElementById('image-format').value;
        const isPng = format === 'png';

        convertBtn.disabled = true;
        statusDiv.style.display = 'block';

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            const totalPages = pdfDoc.numPages;
            const zip = new JSZip();

            for (let i = 1; i <= totalPages; i++) {
                statusText.textContent = `Page ${i} of ${totalPages}`;
                const page = await pdfDoc.getPage(i);

                // Render at higher scale for better image quality
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                // Export to Blob
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, isPng ? 'image/png' : 'image/jpeg', 0.85);
                });

                zip.file(`page-${i}.${format}`, blob);
            }

            statusText.textContent = "Zipping...";
            const content = await zip.generateAsync({ type: "blob" });

            // Download
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedFile.name.replace('.pdf', '')}-images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            statusText.textContent = "Done!";
            setTimeout(() => {
                statusDiv.style.display = 'none';
                convertBtn.disabled = false;
                // Reset
                optionsDiv.style.display = 'none';
                dropZone.style.display = 'block';
                selectedFile = null;
            }, 2000);

        } catch (error) {
            console.error(error);
            alert("An error occurred during conversion.");
            statusDiv.style.display = 'none';
            convertBtn.disabled = false;
        }
    });
}

function initImageEditor() {
    const dropZone = document.getElementById('drop-zone-editor');
    const fileInput = document.getElementById('file-input-editor');
    const editorContainer = document.getElementById('editor-container');
    const editorImage = document.getElementById('editor-image');
    const editorControls = document.getElementById('editor-controls');
    const downloadBtn = document.getElementById('download-editor-btn');

    let cropper = null;
    let originalFile = null;

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            originalFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                editorImage.src = e.target.result;
                dropZone.style.display = 'none';
                editorContainer.style.display = 'block';
                editorControls.style.display = 'block';

                if (cropper) cropper.destroy();
                cropper = new Cropper(editorImage, {
                    viewMode: 1,
                    responsive: true,
                });

                downloadBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image.");
        }
    }

    // Controls
    document.getElementById('rotate-left').addEventListener('click', () => cropper.rotate(-90));
    document.getElementById('rotate-right').addEventListener('click', () => cropper.rotate(90));

    let scaleX = 1, scaleY = 1;
    document.getElementById('scale-x').addEventListener('click', () => { scaleX = -scaleX; cropper.scaleX(scaleX); });
    document.getElementById('scale-y').addEventListener('click', () => { scaleY = -scaleY; cropper.scaleY(scaleY); });

    document.getElementById('btn-crop').addEventListener('click', () => {
        const canvas = cropper.getCroppedCanvas();
        if (canvas) {
            editorImage.src = canvas.toDataURL();
            cropper.destroy();
            cropper = new Cropper(editorImage, { viewMode: 1 });
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!cropper) return;

        let canvas = cropper.getCroppedCanvas();

        // Resize if requested
        const resizeW = parseInt(document.getElementById('resize-w').value);
        if (resizeW && resizeW > 0) {
            // Create a new canvas to resize
            const tmpCanvas = document.createElement('canvas');
            const scale = resizeW / canvas.width;
            tmpCanvas.width = resizeW;
            tmpCanvas.height = canvas.height * scale;
            const ctx = tmpCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
            canvas = tmpCanvas;
        }

        // Compress
        const quality = parseFloat(document.getElementById('compress-q').value) || 0.8;

        const url = canvas.toDataURL(originalFile.type, quality);

        const a = document.createElement('a');
        a.href = url;
        a.download = `edited-${originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

function initMergePdf() {
    const dropZone = document.getElementById('drop-zone-merge');
    const fileInput = document.getElementById('file-input-merge');
    const mergeList = document.getElementById('merge-list');
    const mergeFileList = document.getElementById('merge-file-list');
    const mergeBtn = document.getElementById('merge-btn');

    let files = [];

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });

function handleFiles(newFiles) {
    Array.from(newFiles).forEach(file => {
        if (file.type === 'application/pdf') {
            files.push(file);
        }
    });
    renderList();
}

function renderList() {
    if (files.length > 0) {
        mergeList.style.display = 'block';
        mergeBtn.disabled = false;
    } else {
        mergeList.style.display = 'none';
        mergeBtn.disabled = true;
    }

    mergeFileList.innerHTML = '';
    files.forEach((file, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${file.name} <span style="color:red; cursor:pointer; margin-left:10px;">[x]</span>`;
        li.querySelector('span').onclick = () => {
            files.splice(index, 1);
            renderList();
        };
        mergeFileList.appendChild(li);
    });
}

mergeBtn.addEventListener('click', async () => {
    const pdfDoc = await PDFDocument.create();
    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "merged-document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
}

function initSplitPdf() {
    const dropZone = document.getElementById('drop-zone-split');
    const fileInput = document.getElementById('file-input-split');
    const splitOptions = document.getElementById('split-options');
    const splitFileName = document.getElementById('split-file-name');
    const splitBtn = document.getElementById('split-btn');

    let selectedFile = null;

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });

    function handleFile(file) {
        if (file && file.type === 'application/pdf') {
            selectedFile = file;
            splitFileName.textContent = file.name;
            dropZone.style.display = 'none';
            splitOptions.style.display = 'block';
            splitBtn.disabled = false;
        }
    }

    splitBtn.addEventListener('click', async () => {
        const rangeStr = document.getElementById('split-range').value;
        if (!rangeStr) return;

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const pdfDoc = await PDFDocument.create();
            const totalPages = srcDoc.getPageCount();

            const pagesToAdd = [];
            // Parse range "1-3, 5"
            const parts = rangeStr.split(',');
            for (let part of parts) {
                part = part.trim();
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(Number);
                    for (let i = start; i <= end; i++) {
                        if (i > 0 && i <= totalPages) pagesToAdd.push(i - 1);
                    }
                } else {
                    const p = Number(part);
                    if (p > 0 && p <= totalPages) pagesToAdd.push(p - 1);
                }
            }

            const copiedPages = await pdfDoc.copyPages(srcDoc, pagesToAdd);
            copiedPages.forEach(page => pdfDoc.addPage(page));

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `split-${selectedFile.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            alert("Error splitting PDF. Check page ranges.");
        }
    });
}
// Sign/Annotate
function initSignAnnotate(mode) {
    const dropZone = document.getElementById('drop-zone-sign');
    const fileInput = document.getElementById('file-input-sign');
    const signContainer = document.getElementById('sign-container');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumSpan = document.getElementById('page-num');
    const renderCanvas = document.getElementById('pdf-render-canvas');
    const drawCanvas = document.getElementById('drawing-canvas');
    const clearBtn = document.getElementById('clear-signature');
    const saveBtn = document.getElementById('save-signature');

    let pdfDoc = null;
    let pageNum = 1;
    let totalPages = 1;
    let scale = 1.5;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let selectedFile = null;
    let ctx = drawCanvas.getContext('2d');
    let renderCtx = renderCanvas.getContext('2d');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    async function handleFile(file) {
        if (file && file.type === 'application/pdf') {
            selectedFile = file;
            const arrayBuffer = await file.arrayBuffer();
            pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
            totalPages = pdfDoc.numPages;

            dropZone.style.display = 'none';
            signContainer.style.display = 'block';
            renderPage(pageNum);
        }
    }

    async function renderPage(num) {
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: scale });
        renderCanvas.width = viewport.width;
        renderCanvas.height = viewport.height;
        drawCanvas.width = viewport.width;
        drawCanvas.height = viewport.height;

        await page.render({ canvasContext: renderCtx, viewport: viewport }).promise;
        pageNumSpan.textContent = `Page ${num} of ${totalPages}`;

        // Reset drawing context styles after resize
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        if (mode === 'annotate') {
            const colorPicker = document.getElementById('pen-color');
            ctx.strokeStyle = colorPicker ? colorPicker.value : 'red';
            if (colorPicker) {
                colorPicker.addEventListener('change', (e) => ctx.strokeStyle = e.target.value);
            }
        } else {
            ctx.strokeStyle = 'black';
        }
    }

    prevBtn.addEventListener('click', () => {
        if (pageNum <= 1) return;
        pageNum--;
        renderPage(pageNum);
    });

    nextBtn.addEventListener('click', () => {
        if (pageNum >= totalPages) return;
        pageNum++;
        renderPage(pageNum);
    });

    // Drawing Logic
    drawCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    drawCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        draw(e.offsetX, e.offsetY);
    });
    drawCanvas.addEventListener('mouseup', () => isDrawing = false);
    drawCanvas.addEventListener('mouseout', () => isDrawing = false);

    function draw(x, y) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    });

    saveBtn.addEventListener('click', async () => {
        try {
            // Merge canvas drawing into PDF
            // Note: This is a simplification. Usually you'd use pdf-lib to draw the png of the canvas onto the PDF page.
            // For this demo, we will just download the image of the current page with signature.
            // To do full PDF saving requires saving modifications per page which is complex state management.

            // Let's implement a simple "Download Current Page as Image" for now or try basic pdf-lib embedding.

            const existingPdfBytes = await selectedFile.arrayBuffer();
            const pdfDocLib = await PDFDocument.load(existingPdfBytes);
            const page = pdfDocLib.getPages()[pageNum - 1];

            const signatureImage = drawCanvas.toDataURL('image/png');
            const signatureImageEmbed = await pdfDocLib.embedPng(signatureImage);

            const { width, height } = page.getSize();
            // pdf.js scale vs pdf-lib units. 
            // We need to map canvas coords to pdf coords.

            page.drawImage(signatureImageEmbed, {
                x: 0,
                y: 0,
                width: width,
                height: height,
            });

            const pdfBytes = await pdfDocLib.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `signed-${selectedFile.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            saveBtn.textContent = 'Download PDF';
            saveBtn.disabled = false;
        } catch (err) {
            console.error(err);
            alert('Error saving.');
            saveBtn.textContent = 'Download PDF';
            saveBtn.disabled = false;
        }
    });
}

function initOCR() {
    const dropZone = document.getElementById('drop-zone-ocr');
    const fileInput = document.getElementById('file-input-ocr');
    const ocrResult = document.getElementById('ocr-result');
    const ocrOutput = document.getElementById('ocr-text-output');
    const copyBtn = document.getElementById('copy-text');
    const statusDiv = document.getElementById('processing-status-ocr');
    const statusText = document.getElementById('progress-text-ocr');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });

    async function handleFile(file) {
        if (!file) return;
        dropZone.style.display = 'none';
        statusDiv.style.display = 'block';
        statusText.textContent = "Initializing Engine...";

        try {
            let imageToScan = file;
            if (file.type === 'application/pdf') {
                // Render first page to image
                statusText.textContent = "Converting PDF to Image...";
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                imageToScan = canvas.toDataURL('image/png');
            }

            statusText.textContent = "Recognizing Text...";
            const result = await Tesseract.recognize(
                imageToScan,
                'eng',
                { logger: m => statusText.textContent = `Status: ${m.status} (${Math.round(m.progress * 100)}%)` }
            );

            ocrOutput.value = result.data.text;
            statusDiv.style.display = 'none';
            ocrResult.style.display = 'block';

        } catch (err) {
            console.error(err);
            alert('OCR Failed.');
            statusDiv.style.display = 'none';
            dropZone.style.display = 'block';
        }
    }

    copyBtn.addEventListener('click', () => {
        ocrOutput.select();
        document.execCommand('copy');
        alert('Text Copied!');
    });
}

function initImageCompressor() {
    const dropZone = document.getElementById('drop-zone-img-comp');
    const fileInput = document.getElementById('file-input-img-comp');
    const optionsDiv = document.getElementById('img-comp-options');
    const fileNameDisplay = document.getElementById('selected-img-name');
    const compressBtn = document.getElementById('img-comp-btn');
    const statusDiv = document.getElementById('ic-status');

    const radioSpecific = document.getElementById('ic-specific');
    const radioQuality = document.getElementById('ic-quality');
    const specificContainer = document.getElementById('ic-specific-container');
    const qualityContainer = document.getElementById('ic-quality-container');
    const targetKbInput = document.getElementById('ic-target-kb');
    const qualitySlider = document.getElementById('ic-quality-slider');
    const qualityVal = document.getElementById('ic-quality-val');

    let selectedFile = null;

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            fileNameDisplay.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            optionsDiv.style.display = 'block';
            dropZone.style.display = 'none';
        } else {
            alert("Please select a valid image.");
        }
    }

    // Toggle logic matches PDF tool
    function toggleInputs() {
        if (radioSpecific.checked) {
            specificContainer.style.display = 'block';
            qualityContainer.style.display = 'none';
        } else {
            specificContainer.style.display = 'none';
            qualityContainer.style.display = 'block';
        }
    }
    radioSpecific.addEventListener('change', toggleInputs);
    radioQuality.addEventListener('change', toggleInputs);

    qualitySlider.addEventListener('input', () => {
        qualityVal.textContent = `${qualitySlider.value}%`;
    });

    compressBtn.addEventListener('click', () => {
        if (!selectedFile) return;
        compressBtn.disabled = true;
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Compressing...';

        // Use FileReader to get base64
        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                let dataUrl = null;

                if (radioQuality.checked) {
                    let quality = parseInt(qualitySlider.value) / 100;
                    dataUrl = canvas.toDataURL(selectedFile.type, quality);
                } else {
                    // Logic for specific KB size (Binary Search approximation)
                    const targetKb = parseFloat(targetKbInput.value);
                    const targetBytes = targetKb * 1024;

                    let minQ = 0.01;
                    let maxQ = 1.0;
                    let bestUrl = null;
                    let bestDiff = Infinity;

                    for (let i = 0; i < 15; i++) { // 15 iterations
                        let midQ = (minQ + maxQ) / 2;
                        let attemptUrl = canvas.toDataURL('image/jpeg', midQ); // Force JPEG

                        // Roughly calculate size
                        const head = 'data:image/jpeg;base64,';
                        const size = Math.round((attemptUrl.length - head.length) * 3 / 4);

                        if (Math.abs(size - targetBytes) < bestDiff) {
                            bestDiff = Math.abs(size - targetBytes);
                            bestUrl = attemptUrl;
                        }

                        if (Math.abs(size - targetBytes) < targetBytes * 0.05) {
                            break; // Close enough
                        }

                        if (size > targetBytes) {
                            maxQ = midQ;
                        } else {
                            minQ = midQ;
                        }
                    }
                    dataUrl = bestUrl || canvas.toDataURL('image/jpeg', 0.5);
                }

                // Download
                const a = document.createElement('a');
                a.href = dataUrl;
                // Add -min to filename
                const nameParts = selectedFile.name.split('.');
                const ext = nameParts.pop();
                const newName = `${nameParts.join('.')}-min.${radioSpecific.checked ? 'jpg' : ext}`;
                a.download = newName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                statusDiv.innerText = "Done!";
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                    compressBtn.disabled = false;
                    // Reset
                    optionsDiv.style.display = 'none';
                    dropZone.style.display = 'block';
                    selectedFile = null;
                }, 2000);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
    });
}

// ==========================================
// NEW TOOLS IMPLEMENTATION
// ==========================================

function initRemovePages() {
    setupStandardPdfTool('remove', async (file, pdfDoc, pdfBytes) => {
        const input = document.getElementById('remove-pages-input').value;
        const pagesToRemove = parsePageRange(input, pdfDoc.getPageCount());

        // precise removal: delete indices from high to low to avoid shifting
        pagesToRemove.sort((a, b) => b - a);
        pagesToRemove.forEach(idx => {
            if (idx >= 0 && idx < pdfDoc.getPageCount()) {
                pdfDoc.removePage(idx);
            }
        });

        return await pdfDoc.save();
    });
}

function initExtractPages() {
    setupStandardPdfTool('extract', async (file, pdfDoc, pdfBytes) => {
        const input = document.getElementById('extract-pages-input').value;
        const pagesToKeep = parsePageRange(input, pdfDoc.getPageCount());

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
        copiedPages.forEach(page => newPdf.addPage(page));

        return await newPdf.save();
    });
}

function initOrganizePdf() {
    // Simple version: List pages, allow click to rotate
    const dropZone = document.getElementById('drop-zone-organize');
    const fileInput = document.getElementById('file-input-organize');
    const container = document.getElementById('organize-container');
    const actionArea = document.getElementById('organize-actions');
    const saveBtn = document.getElementById('save-organize-btn');
    let currentBytes = null;
    let pageRotations = [];

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => load(e.target.files[0]);

    async function load(file) {
        if (!file || file.type !== 'application/pdf') return;
        dropZone.style.display = 'none';
        container.style.display = 'flex';
        actionArea.style.display = 'block';

        currentBytes = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(currentBytes).promise;

        pageRotations = new Array(pdf.numPages).fill(0);

        container.innerHTML = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.3 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

            const card = document.createElement('div');
            card.className = 'page-card';
            card.style.border = '1px solid #ccc';
            card.style.margin = '5px';
            card.style.padding = '5px';
            card.style.textAlign = 'center';
            card.style.background = '#333';
            card.innerHTML = `<div style="color:white; margin-bottom:5px;">Page ${i}</div>`;
            card.appendChild(canvas);

            const btn = document.createElement('button');
            btn.innerText = 'Rotate';
            btn.className = 'btn btn-sm btn-secondary';
            btn.style.marginTop = '5px';
            btn.onclick = () => {
                pageRotations[i - 1] = (pageRotations[i - 1] + 90) % 360;
                canvas.style.transform = `rotate(${pageRotations[i - 1]}deg)`;
            };
            card.appendChild(btn);
            container.appendChild(card);
        }
    }

    saveBtn.onclick = async () => {
        if (!currentBytes) return;
        saveBtn.innerText = 'Processing...';
        const pdfDoc = await PDFDocument.load(currentBytes);
        const pages = pdfDoc.getPages();
        pages.forEach((p, i) => {
            p.setRotation(degrees(pageRotations[i]));
        });
        const saved = await pdfDoc.save();
        downloadBlob(saved, 'organized.pdf', 'application/pdf');
        saveBtn.innerText = 'Save PDF';
    };
}

function initScanPdf() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const previews = document.getElementById('scan-previews');
    const startBtn = document.getElementById('start-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const saveBtn = document.getElementById('save-scan-btn');
    let stream = null;
    let images = [];

    startBtn.onclick = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            document.getElementById('camera-container').style.display = 'block';
            document.getElementById('scan-start-area').style.display = 'none';
        } catch (e) {
            alert('Camera access denied or error: ' + e.message);
        }
    };

    captureBtn.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        images.push(dataUrl);

        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.width = '100px';
        img.style.border = '1px solid #ccc';
        previews.appendChild(img);
        saveBtn.disabled = false;
    };

    saveBtn.onclick = () => {
        const pdf = new jsPDF();
        images.forEach((imgData, i) => {
            if (i > 0) pdf.addPage();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        });
        pdf.save('scan.pdf');
        if (stream) stream.getTracks().forEach(track => track.stop());
    };
}

function initWordToPdf() {
    const dropZone = document.getElementById('drop-zone-word');
    const fileInput = document.getElementById('file-input-word');
    const status = document.getElementById('word-status');
    const preview = document.getElementById('word-preview');
    const btn = document.getElementById('word-download-btn');

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => processFile(e.target.files[0]);

    async function processFile(file) {
        if (!file) return;
        status.innerText = 'Converting Docx to HTML...';
        const arrayBuffer = await file.arrayBuffer();
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(result => {
                preview.style.display = 'block';
                preview.innerHTML = result.value;
                status.innerText = 'Conversion Preview Ready. Click Download.';
                btn.disabled = false;
                btn.onclick = () => {
                    html2pdf().from(preview).save(file.name.replace('.docx', '.pdf'));
                };
            })
            .catch(err => {
                status.innerText = 'Error: ' + err.message;
            });
    }
}

function initExcelToPdf() {
    const dropZone = document.getElementById('drop-zone-excel');
    const fileInput = document.getElementById('file-input-excel');
    const status = document.getElementById('excel-status');
    const preview = document.getElementById('excel-preview');
    const btn = document.getElementById('excel-download-btn');

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => processFile(e.target.files[0]);

    async function processFile(file) {
        if (!file) return;
        status.innerText = 'Processing Excel...';
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(firstSheet);

        preview.style.display = 'block';
        preview.innerHTML = html;
        status.innerText = 'Preview Ready.';
        btn.disabled = false;

        btn.onclick = () => {
            html2pdf().from(preview).save(file.name.replace('.xlsx', '.pdf'));
        };
    }
}

function initHtmlToPdf() {
    const dropZone = document.getElementById('drop-zone-html');
    const fileInput = document.getElementById('file-input-html');
    const codeInput = document.getElementById('html-code-input');
    const codeBtn = document.getElementById('convert-html-code-btn');

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                html2pdf().from(ev.target.result).save(file.name + '.pdf');
            };
            reader.readAsText(file);
        }
    };

    codeBtn.onclick = () => {
        const code = codeInput.value;
        if (code) html2pdf().from(code).save('code.pdf');
    };
}

function initRepairPdf() {
    const dropZone = document.getElementById('drop-zone-repair');
    const fileInput = document.getElementById('file-input-repair');
    const status = document.getElementById('repair-status');

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        status.innerText = 'Attempting repair...';
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const bytes = await pdfDoc.save();
            downloadBlob(bytes, 'repaired-' + file.name, 'application/pdf');
            status.innerText = 'Repaired (Regenerated XRef).';
        } catch (e) {
            status.innerText = 'Repair failed: ' + e.message;
        }
    };
}

function parsePageRange(input, maxPages) {
    const pages = new Set();
    const parts = input.split(',');
    parts.forEach(part => {
        part = part.trim();
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) pages.add(i - 1);
            }
        } else {
            const num = Number(part);
            if (!isNaN(num)) pages.add(num - 1);
        }
    });
    return Array.from(pages);
}

function setupStandardPdfTool(prefix, operation) {
    const dropZone = document.getElementById(`drop-zone-${prefix}`);
    const fileInput = document.getElementById(`file-input-${prefix}`);
    const options = document.getElementById(`${prefix}-options`) || document.getElementById(`${prefix}-controls`);
    const nameLabel = document.getElementById(`${prefix}-file-name`) || document.getElementById(`${prefix}-filename`);
    const btn = document.getElementById(`${prefix}-btn`) || document.getElementById(`apply-${prefix}-btn`);

    let currentFile = null;

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            currentFile = file;
            dropZone.style.display = 'none';
            if (options) options.style.display = 'block';
            if (nameLabel) nameLabel.innerText = file.name;
        }
    };

    if (btn) {
        btn.onclick = async () => {
            if (!currentFile) return;
            btn.disabled = true;
            btn.innerText = 'Processing...';
            try {
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const savedBytes = await operation(currentFile, pdfDoc, arrayBuffer);
                if (savedBytes) {
                    downloadBlob(savedBytes, `${prefix}-output.pdf`, 'application/pdf');
                }
                btn.innerText = 'Done';
                setTimeout(() => btn.disabled = false, 2000);
            } catch (e) {
                alert('Error: ' + e.message);
                btn.disabled = false;
            }
        };
    }
}

function downloadBlob(data, fileName, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
}


function initRotatePdf() {
    setupStandardPdfTool('rotate', async (file, pdfDoc, pdfBytes) => {
        // This tool just applies a fixed rotation from commands, 
        // OR we can make the UI allow building a rotation list.
        // For simplicity: The setupStandardPdfTool expects a single 'save' action.
        // But the UI has "Rotate CW" buttons that should update specific state?
        // Actually, initRotatePdf in UI has a "Save Request" button.
        // Let's make "Rotate CW" just update a state variable, and "Save" applies it.

        // Wait, setupStandardPdfTool binds the 'btn' to the operation immediately. 
        // I need to customize the logic slightly. 
        // I'll leave the setupStandardPdfTool for the loading/saving part, 
        // but hijack the buttons for the interaction.

        // Actually, the easiest way is: 
        // On "Rotate CW" button click -> Add to a queue or just update a visualization (if we had one).
        // For this simple implementation: "Save" applies the CURRENT Requested rotation (e.g. +90 all pages).

        // Let's change the UI behavior slightly:
        // Rotate buttons -> Update a label "Current Rotation: 90 deg"
        // Save button -> Apply that rotation.

        let rotationToAdd = 0;
        const info = document.getElementById('rotate-filename');

        document.getElementById('rotate-cw').onclick = () => {
            rotationToAdd = (rotationToAdd + 90) % 360;
            info.innerText = `Selected: ${file.name} (Rotation: ${rotationToAdd}°)`;
        };

        document.getElementById('rotate-ccw').onclick = () => {
            rotationToAdd = (rotationToAdd - 90) % 360;
            if (rotationToAdd < 0) rotationToAdd += 360;
            info.innerText = `Selected: ${file.name} (Rotation: ${rotationToAdd}°)`;
        };

        const pages = pdfDoc.getPages();
        pages.forEach(page => {
            const current = page.getRotation().angle;
            page.setRotation(PDFLib.degrees(current + rotationToAdd));
        });

        return await pdfDoc.save();
    });
}

function initProtectPdf() {
    setupStandardPdfTool('protect', async (file, pdfDoc, pdfBytes) => {
        const password = document.getElementById('protect-password').value;
        if (!password) throw new Error("Password cannot be empty");

        pdfDoc.encrypt({
            userPassword: password,
            ownerPassword: password,
            permissions: {
                printing: 'highResolution',
                modifying: false,
                copying: false,
                annotating: false,
                fillingForms: false,
                contentAccessibility: false,
                documentAssembly: false,
            },
        });

        return await pdfDoc.save();
    });
}

function initUnlockPdf() {
    // specific impl because we need password at load time
    const dropZone = document.getElementById('drop-zone-unlock');
    const fileInput = document.getElementById('file-input-unlock');
    const controls = document.getElementById('unlock-controls');
    const btn = document.getElementById('apply-unlock-btn');
    let currentFile = null;

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        currentFile = e.target.files[0];
        if (currentFile) {
            dropZone.style.display = 'none';
            controls.style.display = 'block';
            document.getElementById('unlock-filename').innerText = currentFile.name;
        }
    };

    btn.onclick = async () => {
        if (!currentFile) return;
        const password = document.getElementById('unlock-password').value;
        btn.innerText = 'Decrypting...';
        try {
            const arrayBuffer = await currentFile.arrayBuffer();
            // Load with password
            const pdfDoc = await PDFDocument.load(arrayBuffer, { password: password });

            // Saving without encryption options removes security?
            // "If you want to save the document without encryption, you don't need to do anything special."
            const savedBytes = await pdfDoc.save();
            downloadBlob(savedBytes, 'unlocked-' + currentFile.name, 'application/pdf');
            btn.innerText = 'Done';
        } catch (e) {
            alert('Failed to unlock: ' + e.message);
            btn.innerText = 'Decrypt & Save';
        }
    };
}

function initPageNumbers() {
    setupStandardPdfTool('pagenum', async (file, pdfDoc, pdfBytes) => {
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        pages.forEach((page, idx) => {
            const { width, height } = page.getSize();
            const text = `${idx + 1}`;
            const textSize = 12;
            const textWidth = font.widthOfTextAtSize(text, textSize);

            page.drawText(text, {
                x: width / 2 - textWidth / 2,
                y: 20,
                size: textSize,
                font: font,
                color: PDFLib.rgb(0, 0, 0),
            });
        });

        return await pdfDoc.save();
    });
}

function initWatermarkPdf() {
    setupStandardPdfTool('watermark', async (file, pdfDoc, pdfBytes) => {
        const text = document.getElementById('watermark-text').value || "CONFIDENTIAL";
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        pages.forEach(page => {
            const { width, height } = page.getSize();
            const fontSize = 50;
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            const textHeight = font.heightAtSize(fontSize);

            page.drawText(text, {
                x: width / 2 - textWidth / 2,
                y: height / 2 - textHeight / 2,
                size: fontSize,
                font: font,
                color: PDFLib.rgb(0.7, 0.7, 0.7), // Gray
                opacity: 0.5,
                rotate: PDFLib.degrees(45),
            });
        });

        return await pdfDoc.save();
    });
}



// --- Business Calculator Helper ---
function setupCalculator(toolId, calculateFn) {
    const form = document.getElementById(`${toolId}-form`);
    const resultDiv = document.getElementById(`${toolId}-result`);

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            // Convert strings to numbers where possible
            for (let key in data) {
                if (data[key] && !isNaN(data[key])) {
                    data[key] = parseFloat(data[key]);
                }
            }

            try {
                const result = calculateFn(data);
                resultDiv.innerHTML = result;
                resultDiv.style.display = 'block';
            } catch (error) {
                resultDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
                resultDiv.style.display = 'block';
            }
        };
    }
}

// --- Specific Calculator Logic ---

function initCalcBusiness() {
    setupCalculator('calc-business', (data) => {
        // Simple Arithmetic Calculator UI is likely better handled by just evaluating input
        // But let's act as a Margin/Markup tool since "Business Calculator" is vague
        // Let's implement a "Margin vs Markup" Calculator
        const cost = data.cost || 0;
        const revenue = data.revenue || 0;

        let profit = revenue - cost;
        let margin = (profit / revenue) * 100;
        let markup = (profit / cost) * 100;

        if (revenue === 0) margin = 0;
        if (cost === 0) markup = 0;

        return `
            <h4>Result</h4>
            <p><strong>Profit:</strong> ${profit.toFixed(2)}</p>
            <p><strong>Gross Margin:</strong> ${margin.toFixed(2)}%</p>
            <p><strong>Markup:</strong> ${markup.toFixed(2)}%</p>
        `;
    });
}

function initCalcGst() {
    setupCalculator('calc-gst', (data) => {
        const amount = data.amount || 0;
        const rate = data.rate || 0;
        const type = data.type; // 'exclusive' or 'inclusive'

        let gstAmount = 0;
        let total = 0;
        let net = 0;

        if (type === 'inclusive') {
            gstAmount = amount - (amount * (100 / (100 + rate)));
            net = amount - gstAmount;
            total = amount;
        } else {
            gstAmount = amount * (rate / 100);
            net = amount;
            total = amount + gstAmount;
        }

        return `
            <h4>GST Result (${type})</h4>
            <p><strong>Net Amount:</strong> ${net.toFixed(2)}</p>
            <p><strong>GST Amount (${rate}%):</strong> ${gstAmount.toFixed(2)}</p>
            <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
        `;
    });
}

function initCalcPnl() {
    setupCalculator('calc-pnl', (data) => {
        const cp = data.cp || 0;
        const sp = data.sp || 0;
        const diff = sp - cp;
        const isProfit = diff >= 0;
        const percent = (Math.abs(diff) / cp) * 100;

        return `
            <h4>${isProfit ? 'Profit' : 'Loss'} Result</h4>
            <p style="color: ${isProfit ? 'green' : 'red'}"><strong>${isProfit ? 'Profit' : 'Loss'}:</strong> ${Math.abs(diff).toFixed(2)}</p>
            <p><strong>Percentage:</strong> ${percent.toFixed(2)}%</p>
        `;
    });
}

function initCalcRoi() {
    setupCalculator('calc-roi', (data) => {
        const investment = data.investment || 0;
        const ret = data.ret || 0;
        const gain = ret - investment;
        const roi = (gain / investment) * 100;

        return `
            <h4>ROI Result</h4>
            <p><strong>Total Gain:</strong> ${gain.toFixed(2)}</p>
            <p><strong>ROI:</strong> ${roi.toFixed(2)}%</p>
        `;
    });
}

function initCalcLoan() {
    setupCalculator('calc-loan', (data) => {
        const p = data.principal || 0;
        const r = (data.rate || 0) / 12 / 100; // Monthly rate
        const n = (data.tenure || 0) * 12; // Months

        if (p <= 0 || r <= 0 || n <= 0) return "Please enter valid positive values.";

        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - p;

        return `
            <h4>EMI Result</h4>
            <p><strong>Monthly EMI:</strong> ${emi.toFixed(2)}</p>
            <p><strong>Total Interest:</strong> ${totalInterest.toFixed(2)}</p>
            <p><strong>Total Payment:</strong> ${totalPayment.toFixed(2)}</p>
        `;
    });
}

function initCalcTax() {
    setupCalculator('calc-tax', (data) => {
        const income = data.income || 0;
        const rate = data.rate || 0;
        const tax = income * (rate / 100);
        const net = income - tax;

        return `
            <h4>Tax Result</h4>
            <p><strong>Tax Payable:</strong> ${tax.toFixed(2)}</p>
            <p><strong>Net Income:</strong> ${net.toFixed(2)}</p>
        `;
    });
}

function initCalcBreakeven() {
    setupCalculator('calc-breakeven', (data) => {
        const fixed = data.fixed || 0;
        const price = data.price || 0;
        const variable = data.variable || 0;

        if (price <= variable) return "Price must be greater than variable cost per unit.";

        const units = fixed / (price - variable);
        const revenue = units * price;

        return `
            <h4>Break-Even Point</h4>
            <p><strong>Ref (Units):</strong> ${Math.ceil(units)} units</p>
            <p><strong>Revenue:</strong> ${revenue.toFixed(2)}</p>
        `;
    });
}

function initCalcCashflow() {
    setupCalculator('calc-cashflow', (data) => {
        const inflow = data.inflow || 0;
        const outflow = data.outflow || 0;
        const net = inflow - outflow;

        return `
            <h4>Cash Flow Result</h4>
            <p><strong>Total Inflow:</strong> ${inflow.toFixed(2)}</p>
            <p><strong>Total Outflow:</strong> ${outflow.toFixed(2)}</p>
            <p style="color: ${net >= 0 ? 'green' : 'red'}"><strong>Net Cash Flow:</strong> ${net.toFixed(2)}</p>
        `;
    });
}

function initCalcPricing() {
    setupCalculator('calc-pricing', (data) => {
        const cost = data.cost || 0;
        const margin = data.margin || 0;

        if (margin >= 100) return "Margin must be less than 100%.";

        const price = cost / (1 - (margin / 100));
        const profit = price - cost;

        return `
            <h4>Pricing Result</h4>
            <p><strong>Selling Price:</strong> ${price.toFixed(2)}</p>
            <p><strong>Profit per Unit:</strong> ${profit.toFixed(2)}</p>
        `;
    });
}

function initCalcCost() {
    setupCalculator('calc-cost', (data) => {
        const material = data.material || 0;
        const labor = data.labor || 0;
        const overhead = data.overhead || 0;
        const total = material + labor + overhead;

        return `
            <h4>Cost Analysis</h4>
            <p><strong>Total Cost:</strong> ${total.toFixed(2)}</p>
        `;
    });
}

function initCalcTvm() {
    setupCalculator('calc-tvm', (data) => {
        const pv = data.pv || 0;
        const rate = data.rate || 0;
        const time = data.time || 0;

        // Future Value Formula: FV = PV * (1 + r)^n
        const fv = pv * Math.pow((1 + rate / 100), time);
        const interest = fv - pv;

        return `
            <h4>TVM Result (Future Value)</h4>
            <p><strong>Future Value:</strong> ${fv.toFixed(2)}</p>
            <p><strong>Total Interest:</strong> ${interest.toFixed(2)}</p>
        `;
    });
}

function initCalcPayroll() {
    setupCalculator('calc-payroll', (data) => {
        const gross = data.gross || 0;
        const deductions = data.deductions || 0;
        const net = gross - deductions;

        return `
            <h4>Payroll Result</h4>
            <p><strong>Gross Pay:</strong> ${gross.toFixed(2)}</p>
            <p><strong>Total Deductions:</strong> ${deductions.toFixed(2)}</p>
            <p><strong>Net Pay:</strong> ${net.toFixed(2)}</p>
        `;
    });
}

function initCalcLogistics() {
    setupCalculator('calc-logistics', (data) => {
        const distance = data.distance || 0;
        const weight = data.weight || 0;
        const rate = data.rate || 0;

        const cost = distance * weight * rate;

        return `
            <h4>Logistics Cost</h4>
            <p><strong>Total Cost:</strong> ${cost.toFixed(2)}</p>
        `;
    });
}

function initCalcRetail() {
    setupCalculator('calc-retail', (data) => {
        const cost = data.cost || 0;
        const markup = data.markup || 0;

        const price = cost * (1 + markup / 100);
        const profit = price - cost;

        return `
            <h4>Retail Pricing</h4>
            <p><strong>Retail Price:</strong> ${price.toFixed(2)}</p>
            <p><strong>Profit:</strong> ${profit.toFixed(2)}</p>
        `;
    });
}

function initCalcWorkingcapital() {
    setupCalculator('calc-workingcapital', (data) => {
        const assets = data.assets || 0;
        const liabilities = data.liabilities || 0;
        const wc = assets - liabilities;

        return `
            <h4>Working Capital</h4>
            <p><strong>Current Assets:</strong> ${assets.toFixed(2)}</p>
            <p><strong>Current Liabilities:</strong> ${liabilities.toFixed(2)}</p>
            <p style="color: ${wc >= 0 ? 'green' : 'red'}"><strong>Working Capital:</strong> ${wc.toFixed(2)}</p>
        `;
    });
}

// --- Core Business Logic Helpers ---
function saveBizData(key, data) {
    try {
        localStorage.setItem('antigravity_' + key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Save failed", e);
        return false;
    }
}

function getBizData(key) {
    try {
        const data = localStorage.getItem('antigravity_' + key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Load failed", e);
        return null;
    }
}

// --- Company Profile Tool ---
function initBizProfile() {
    const form = document.getElementById('biz-profile-form');
    // Load existing data
    const existing = getBizData('biz_profile') || {};

    if (form) {
        // Populate form
        Object.keys(existing).forEach(key => {
            if (form.elements[key]) form.elements[key].value = existing[key];
        });

        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (saveBizData('biz_profile', data)) {
                alert('Company Profile Saved Successfully!');
            } else {
                alert('Failed to save profile.');
            }
        };
    }
}

// --- Client Management Tool ---
function initBizClients() {
    const form = document.getElementById('biz-client-form');
    const tableBody = document.querySelector('#biz-client-list tbody');
    let clients = getBizData('biz_clients') || [];

    function renderClients() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        clients.forEach((client, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.name}</td>
                <td>${client.email || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button" onclick="deleteClient(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Expose delete function
    window.deleteClient = (index) => {
        if (confirm('Are you sure you want to delete this client?')) {
            clients.splice(index, 1);
            saveBizData('biz_clients', clients);
            renderClients();
        }
    };

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            clients.push(data);
            saveBizData('biz_clients', clients);
            renderClients();
            form.reset();
        };
    }

    renderClients();
}

// --- Invoice Generator Tool ---
function initBizInvoice() {
    const clientSelect = document.getElementById('inv-client-select');
    const itemsTable = document.getElementById('inv-items-table');
    const addItemBtn = document.getElementById('inv-add-item');
    const generateBtn = document.getElementById('inv-generate-btn');
    const invoicePreview = document.getElementById('invoice-preview-area');

    // Load Clients
    const clients = getBizData('biz_clients') || [];
    if (clientSelect) {
        clientSelect.innerHTML = '<option value="">Select Client...</option>';
        clients.forEach((c, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            // Store client data in dataset for easy retrieval
            opt.dataset.name = c.name;
            opt.dataset.address = c.address || '';
            opt.innerText = c.name;
            clientSelect.appendChild(opt);
        });

        clientSelect.addEventListener('change', (e) => {
            const selected = e.target.selectedOptions[0];
            if (selected && selected.value !== "") {
                document.getElementById('inv-client-name').textContent = selected.dataset.name;
                document.getElementById('inv-client-address').textContent = selected.dataset.address;
            } else {
                document.getElementById('inv-client-name').textContent = "Client Name";
                document.getElementById('inv-client-address').textContent = "Client Address";
            }
        });
    }

    // Load Company Profile
    const profile = getBizData('biz_profile') || {};
    if (document.getElementById('inv-company-name')) {
        document.getElementById('inv-company-name').textContent = profile.name || 'Your Company Name';
        document.getElementById('inv-company-address').textContent = profile.address || 'Company Address Line\nCity, State, Zip';
    }

    // Item Row Logic
    function addItemRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="form-control inv-desc" placeholder="Description"></td>
            <td><input type="number" class="form-control inv-qty" value="1" min="1" style="width: 80px"></td>
            <td><input type="number" class="form-control inv-rate" value="0" min="0" style="width: 100px"></td>
            <td class="inv-total" style="text-align: right; padding-right: 10px;">0.00</td>
            <td><button class="btn btn-sm btn-danger" onclick="this.closest('tr').remove(); updateInvoiceTotals()">X</button></td>
        `;
        // Add listeners for calc
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateInvoiceTotals);
        });
        itemsTable.querySelector('tbody').appendChild(row);
    }

    window.updateInvoiceTotals = () => {
        let subtotal = 0;
        itemsTable.querySelectorAll('tbody tr').forEach(row => {
            const qty = parseFloat(row.querySelector('.inv-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.inv-rate').value) || 0;
            const total = qty * rate;
            row.querySelector('.inv-total').textContent = total.toFixed(2);
            subtotal += total;
        });

        const taxRate = parseFloat(document.getElementById('inv-tax-rate').value) || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;

        document.getElementById('inv-subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('inv-tax-amount').textContent = taxAmount.toFixed(2);
        document.getElementById('inv-grand-total').textContent = grandTotal.toFixed(2);
    };

    if (addItemBtn) addItemBtn.onclick = addItemRow;

    if (document.getElementById('inv-tax-rate')) {
        document.getElementById('inv-tax-rate').addEventListener('input', updateInvoiceTotals);
    }

    // Update date on change
    const dateInput = document.getElementById('inv-date-input');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            document.getElementById('inv-date-display').textContent = e.target.value;
        });
        // Set today
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        document.getElementById('inv-date-display').textContent = today;
    }

    if (generateBtn) {
        generateBtn.onclick = () => {
            const element = document.getElementById('invoice-preview-area');
            // Hide controls for PDF generation? 
            // Better: use a specific printable area logic or clone.
            // For simplicity, we just print the 'invoice-preview-area'. 
            // Note: The inputs inside the table might look like inputs in PDF.
            // Ideally we'd replace inputs with text for the PDF, but let's see how html2pdf handles it.
            // Often it renders inputs as they look.

            // Temporary styles to make inputs look like text
            element.classList.add('printing-mode');

            const opt = {
                margin: 10,
                filename: 'invoice.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                element.classList.remove('printing-mode');
            });
        };
    }

    // Add one empty row initially
    addItemRow();
}

// --- Expense Tracker Tool ---
function initBizExpense() {
    const form = document.getElementById('biz-expense-form');
    const tableBody = document.querySelector('#biz-expense-list tbody');
    let expenses = getBizData('biz_expenses') || [];

    function renderExpenses() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        let total = 0;
        expenses.forEach((expense, index) => {
            total += parseFloat(expense.amount) || 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td style="text-align:right">${parseFloat(expense.amount).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button" onclick="deleteExpense(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        document.getElementById('exp-total').innerText = total.toFixed(2);
    }

    window.deleteExpense = (index) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            expenses.splice(index, 1);
            saveBizData('biz_expenses', expenses);
            renderExpenses();
        }
    };

    if (form) {
        // Set today's date
        const dateInput = form.querySelector('[name="date"]');
        if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];

        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.id = Date.now();
            expenses.push(data);
            saveBizData('biz_expenses', expenses);
            renderExpenses();
            form.reset();
            // Reset date
            if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        };
    }
    renderExpenses();
}

// --- Payments Manager Tool ---
function initBizPayments() {
    const form = document.getElementById('biz-payment-form');
    const tableBody = document.querySelector('#biz-payment-list tbody');
    let payments = getBizData('biz_payments') || [];

    function renderPayments() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            const isIncoming = payment.type === 'incoming';
            row.innerHTML = `
                <td>${payment.date}</td>
                <td><span class="badge ${isIncoming ? 'badge-success' : 'badge-warning'}">${isIncoming ? 'Incoming' : 'Outgoing'}</span></td>
                <td>${payment.reference}</td>
                <td style="text-align:right; color: ${isIncoming ? 'green' : 'red'}">${parseFloat(payment.amount).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button" onclick="deletePayment(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.deletePayment = (index) => {
        if (confirm('Are you sure you want to delete this payment?')) {
            payments.splice(index, 1);
            saveBizData('biz_payments', payments);
            renderPayments();
        }
    };

    if (form) {
        // Set today's date
        const dateInput = form.querySelector('[name="date"]');
        if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];

        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.id = Date.now();
            payments.push(data);
            saveBizData('biz_payments', payments);
            renderPayments();
            form.reset();
            if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        };
    }
    renderPayments();
}

// --- Revenue Reports Tool ---
function initBizRevenue() {
    const periodSelect = document.getElementById('rev-period-select');
    // In a real app, we'd filter by period. For now, we show all-time summary.

    function calculateMetrics() {
        const expenses = getBizData('biz_expenses') || [];
        const payments = getBizData('biz_payments') || [];

        let totalRevenue = 0;
        let totalExpenses = 0;

        // Sum expenses
        expenses.forEach(e => totalExpenses += parseFloat(e.amount) || 0);

        // Sum incoming payments (Revenue)
        payments.forEach(p => {
            if (p.type === 'incoming') {
                totalRevenue += parseFloat(p.amount) || 0;
            } else {
                // Outgoing payments could act as expenses too, preventing double counting depends on user intent.
                // For this simple logic: Expense Tracker tracks operation costs, Payments tracks cash flow.
                // We'll treat Outgoing Payments as money leaving but distinct from "Expense Tracker" items unless we merge them.
                // To avoid confusion, let's treat "Revenue" strictly as Incoming Payments.
                // And "Total Expenses" as sum of Expense Tracker + Outgoing Payments? 
                // Let's keep it simple: Revenue = Incoming Payments. Expense = Expense Tracker entries.
            }
        });

        const netProfit = totalRevenue - totalExpenses;

        document.getElementById('rep-revenue').innerText = totalRevenue.toFixed(2);
        document.getElementById('rep-expenses').innerText = totalExpenses.toFixed(2);
        const profitEl = document.getElementById('rep-profit');
        profitEl.innerText = netProfit.toFixed(2);
        profitEl.style.color = netProfit >= 0 ? 'green' : 'red';
    }

    calculateMetrics();
}

// --- Vendor Management Tool ---
function initBizVendor() {
    const form = document.getElementById('biz-vendor-form');
    const tableBody = document.querySelector('#biz-vendor-list tbody');
    let vendors = getBizData('biz_vendors') || [];

    function renderVendors() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        vendors.forEach((vendor, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vendor.name}</td>
                <td>${vendor.service}</td>
                <td>${vendor.contact}</td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button" onclick="deleteVendor(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.deleteVendor = (index) => {
        if (confirm('Delete this vendor?')) {
            vendors.splice(index, 1);
            saveBizData('biz_vendors', vendors);
            renderVendors();
        }
    };

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            vendors.push(data);
            saveBizData('biz_vendors', vendors);
            renderVendors();
            form.reset();
        };
    }
    renderVendors();
}

// --- Team Management Tool ---
function initBizTeam() {
    const form = document.getElementById('biz-team-form');
    const tableBody = document.querySelector('#biz-team-list tbody');
    let team = getBizData('biz_team') || [];

    function renderTeam() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        team.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.email}</td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button" onclick="deleteTeamMember(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.deleteTeamMember = (index) => {
        if (confirm('Remove this team member?')) {
            team.splice(index, 1);
            saveBizData('biz_team', team);
            renderTeam();
        }
    };

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.id = Date.now(); // Unique ID for attendance matching
            team.push(data);
            saveBizData('biz_team', team);
            renderTeam();
            form.reset();
        };
    }
    renderTeam();
}

// --- Attendance System Tool ---
function initBizAttendance() {
    const employeeSelect = document.getElementById('att-employee-select');
    const logsTable = document.querySelector('#att-logs-list tbody');
    const markBtn = document.getElementById('att-mark-btn');

    // Load Team
    const team = getBizData('biz_team') || [];
    if (employeeSelect) {
        employeeSelect.innerHTML = '<option value="">Select Employee...</option>';
        team.forEach(member => {
            const opt = document.createElement('option');
            opt.value = member.id; // Use ID
            opt.innerText = member.name;
            employeeSelect.appendChild(opt);
        });
    }

    let logs = getBizData('biz_attendance') || [];

    function renderLogs() {
        if (!logsTable) return;
        logsTable.innerHTML = '';
        // Show last 20 logs
        logs.slice(-20).reverse().forEach(log => {
            const member = team.find(m => m.id == log.employeeId);
            const name = member ? member.name : 'Unknown';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.date}</td>
                <td>${name}</td>
                <td>${log.status}</td>
            `;
            logsTable.appendChild(row);
        });
    }

    if (markBtn) {
        markBtn.onclick = () => {
            const empId = document.getElementById('att-employee-select').value;
            const status = document.getElementById('att-status-select').value;
            const date = document.getElementById('att-date').value;

            if (!empId || !date) {
                alert('Please select employee and date');
                return;
            }

            logs.push({
                employeeId: empId,
                status: status,
                date: date,
                timestamp: Date.now()
            });

            saveBizData('biz_attendance', logs);
            renderLogs();
            alert('Attendance Marked');
        };

        // Set Today
        const dateInput = document.getElementById('att-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }

    renderLogs();
}

// --- Leave Management Tool ---
function initBizLeave() {
    const employeeSelect = document.getElementById('leave-employee-select');
    const leaveTable = document.querySelector('#leave-list tbody');
    const form = document.getElementById('biz-leave-form');

    // Load Team
    const team = getBizData('biz_team') || [];
    if (employeeSelect) {
        employeeSelect.innerHTML = '<option value="">Select Employee...</option>';
        team.forEach(member => {
            const opt = document.createElement('option');
            opt.value = member.id;
            opt.innerText = member.name;
            employeeSelect.appendChild(opt);
        });
    }

    let leaves = getBizData('biz_leaves') || [];

    function renderLeaves() {
        if (!leaveTable) return;
        leaveTable.innerHTML = '';
        leaves.forEach((leave, index) => {
            const member = team.find(m => m.id == leave.employeeId);
            const name = member ? member.name : 'Unknown';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>${leave.start} to ${leave.end}</td>
                <td>${leave.reason}</td>
                <td>
                    <select onchange="updateLeaveStatus(${index}, this.value)" style="padding:2px;">
                        <option value="Pending" ${leave.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Approved" ${leave.status === 'Approved' ? 'selected' : ''}>Approved</option>
                        <option value="Rejected" ${leave.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
            `;
            leaveTable.appendChild(row);
        });
    }

    window.updateLeaveStatus = (index, status) => {
        leaves[index].status = status;
        saveBizData('biz_leaves', leaves);
    };

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.status = 'Pending';
            leaves.push(data);
            saveBizData('biz_leaves', leaves);
            renderLeaves();
            form.reset();
        };
    }

    renderLeaves();
}

// --- Business Dashboard & Analytics ---
// Reusing similar logic for both for now, but different views
function initBizDashboard() {
    // Aggregate Data
    const revenue = (getBizData('biz_payments') || [])
        .filter(p => p.type === 'incoming')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    const expenses = (getBizData('biz_expenses') || [])
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    const teamCount = (getBizData('biz_team') || []).length;
    const clientCount = (getBizData('biz_clients') || []).length;
    const pendingLeaves = (getBizData('biz_leaves') || []).filter(l => l.status === 'Pending').length;

    document.getElementById('dash-revenue').innerText = revenue.toFixed(2);
    document.getElementById('dash-expense').innerText = expenses.toFixed(2);
    document.getElementById('dash-profit').innerText = (revenue - expenses).toFixed(2);
    document.getElementById('dash-team').innerText = teamCount;
    document.getElementById('dash-clients').innerText = clientCount;
    document.getElementById('dash-leaves').innerText = pendingLeaves;
}

calculateMetrics();
}

// --- CSV Export Helper ---
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        alert('No data to export!');
        return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename, 'text/csv');
}

// --- Business Analytics (Charts) ---
function initBizAnalytics() {
    // 1. Prepare Data
    const expenses = getBizData('biz_expenses') || [];
    const payments = getBizData('biz_payments') || [];
    const revenueItems = payments.filter(p => p.type === 'incoming');

    // Revenue vs Expense (Monthly) - Simplified to just totals for MVP or by Category
    const totalRev = revenueItems.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalExp = expenses.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    // Expense by Category
    const categoryMap = {};
    expenses.forEach(e => {
        const cat = e.category || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + (parseFloat(e.amount) || 0);
    });

    const categories = Object.keys(categoryMap);
    const categoryData = Object.values(categoryMap);

    // 2. Render Charts
    setTimeout(() => { // Small delay to ensure DOM is ready
        // Revenue vs Expense
        const ctx1 = document.getElementById('chart-rev-exp');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Revenue', 'Expenses', 'Profit'],
                    datasets: [{
                        label: 'Financials',
                        data: [totalRev, totalExp, totalRev - totalExp],
                        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
                    }]
                },
                options: { responsive: true }
            });
        }

        // Expense Breakdown
        const ctx2 = document.getElementById('chart-exp-cat');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: categories,
                    datasets: [{
                        data: categoryData,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ]
                    }]
                },
                options: { responsive: true }
            });
        }
    }, 100);
}
