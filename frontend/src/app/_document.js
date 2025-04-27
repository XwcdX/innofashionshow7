import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
        <Html lang="en">
            <Head>
            {/* Include DataTables CSS */}
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css"
            />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
        )
    }
}

export default MyDocument
