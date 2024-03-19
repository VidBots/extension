document.addEventListener("DOMContentLoaded", function () {

    var button = document.getElementById("notesOption");
    button.addEventListener("click", function notesOption() {

    })

    var markdownEdit = document.getElementById("markdownButton");
    markdownEdit.addEventListener("click", function markdownEdit() {

        var mainContainer = document.getElementById("mainContainer");
        var markdownHtml = document.getElementById("markdownHtml");

        mainContainer.style.display = "none"
        markdownHtml.style.display = "block";

    })

    renderNotes("test");

    var userInput = document.getElementById("user-input");

    userInput.addEventListener("keydown", function (event) {

        // Check if the pressed key is Enter and simultaneously the Shift key is pressed (key is "Enter" and shiftKey is true)
        if (event.key === "Enter" && event.shiftKey) {
            // Allow default Shift + Enter line break behavior
            return;
        }

        // Check if the pressed key is Enter (key is "Enter")
        if (event.key === "Enter") {
            // Prevent default Enter line break behavior
            event.preventDefault();
            // Trigger the button click event
            submitButton.click();
        }

    });

    var submitButton = document.getElementById("submit-btn");
    submitButton.addEventListener("click", function () {

        userInput.value = "";

        // Send message to content.js
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "feedback_submit" });
        });

    })


})

function renderNotes(notesJsonData) {
    var mdString = notesJsonData;
    // Convert md string to html string
    const mdStringtest = `## Lecture : Big Data Challenges in Data Management Lectures\n\n## I. Introduction\nThe advent of the big data era has brought tremendous opportunities for enterprises, along with a series of complex data management challenges. Effective data management is key to successfully addressing these challenges. This lecture will introduce the main challenges faced by data management in the context of big data and corresponding strategies.\n\n## II. Characteristics of Big Data\n1. **Huge Volume of Data:** Traditional databases struggle to handle massive amounts of data, necessitating new storage and processing methods.\n2. **Diverse Data Types:** Big data includes not only structured data but also semi-structured and unstructured data, such as text, images, and videos.\n3. **Real-Time Requirements:** Some applications require real-time analysis and processing of data, demanding higher speeds for data processing.\n\n## III. Data Management Challenges\n\n### 1. Storage and Processing\n   - a. **Distributed Storage:** Data storage is no longer a problem for a single database but involves distributed storage systems, such as the Hadoop Distributed File System (HDFS).\n   - b. **Real-Time Processing:** Real-time data processing introduces new technologies, such as stream processing, to meet the demands for data real-time processing.\n\n### 2. Data Quality and Consistency\n   - a. **Data Quality:** In the big data environment, with complex and diverse data sources, ensuring data quality is challenging. Data cleaning and validation mechanisms are needed.\n   - b. **Consistency:** Data consistency issues in distributed systems, such as transaction management in distributed databases.\n\n### 3. Data Security and Privacy\n   - a. **Data Leakage Risk:** Big data involves massive amounts of data, and once leaked, it can lead to significant losses. Data encryption, access control, and other technologies are crucial.\n   - b. **Compliance Requirements:** Data management needs to comply with various regulations and standards, such as GDPR, HIPAA, etc.\n\n### 4. Data Integration and Workflow\n   - a. **Multi-Source Data Integration:** Data integration from different departments and systems becomes more complex and requires advanced Extract, Transform, Load (ETL) tools and technologies.\n   - b. **Workflow Management:** Design and manage data flows to ensure effective management and monitoring of data throughout its lifecycle.\n\n### 5. Data Analysis and Mining\n   - a. **Diversity of Analysis Tools:** There are various analysis tools in the big data environment, and choosing the right one is crucial.\n`;

    var htmlString = marked.parse(mdStringtest);
    // Get the html container
    var mdContainer = document.getElementById("notesContent");
    // Insert the html string into the html container
    mdContainer.innerHTML = htmlString;

}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.action === "backText") {
        // Execute background task
        var mainContainer = document.getElementById("mainContainer");
        var markdownHtml = document.getElementById("markdownHtml");

        mainContainer.style.display = "block"
        markdownHtml.style.display = "none";
    }

});
