import { SiTypescript } from "react-icons/si";
import React from 'react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import CopyButton from './CopyButton'


interface props {
    appId?: string
}

export default function Docs({ appId = "your_app_id" }: props) {


    const code = [
        `import { AnalyticsTracker } from '@oanalytics/next';`,
        `export default function RootLayout({`,
        `  children,`,
        `}: {`,
        `  children: React.ReactNode;`,
        `}) {`,
        `  return (`,
        `    <html lang="en">`,
        `      <head>`,
        `        <title>Next.js</title>`,
        `      </head>`,
        `      <body>`,
        `        {children}`,
        `        <AnalyticsTracker appId="${appId}"/>`,
        `      </body>`,
        `    </html>`,
        `  );`,
        `}`,
    ];



    return (
        <Dialog>
            <DialogTrigger className="button-class px-2 py-1 cursor-pointer hover:bg-success-background hover:text-success text-white border border-border hover:border-success-background">
                Setup It
            </DialogTrigger>
            <DialogContent className='h-[80vh] !max-w-none w-[90vw] overflow-y-scroll'>
                <div className="text-white space-y-5">
                    <div>
                        <h1 className="text-3xl">Get Started</h1>
                        <h3>To start counting visitors and page views, follow these steps.</h3>
                    </div>
                    <div className="text-offwhite space-y-3">
                        <div className='flex items-start gap-3'>
                            <h2 className='docs-pagination'>1</h2>
                            <div className="text-lg font-semibold">
                                <h2>Add <code className='inline-code'>@oanalytics/next</code> to your project</h2>
                                <p className='text-sm text-muted text-normal'>Using the package manager of your choice, add the @oanalytics/next package to your project:</p>
                            </div>
                        </div>
                        <div className='ml-10 bg-secondary-background rounded-md border border-border'>
                            <div className='py-1 px-5'>
                                <code className=''>npm</code>
                            </div>
                            <div className='bg-soft-background py-3 px-5 border-t border-border w-full relative'>
                                <code>npm i @vercel/analytics</code>
                                <div className='text-white absolute top-1/2 -translate-y-1/2 right-5'>
                                    <CopyButton
                                        className='cursor-pointer hover:text-success transition-all'
                                        text='npm i @vercel/analytics' />
                                </div>
                            </div>
                        </div>
                        <div className='flex items-start gap-3 mt-10'>
                            <h2 className='docs-pagination'>2</h2>
                            <div className="text-lg font-semibold">
                                <h2>Add The <code className='inline-code'>AnalyticsTracker</code> component to your app</h2>
                                <p className='text-sm text-muted text-normal'>Add the following code to the root layout:</p>
                            </div>
                        </div>
                        <div className='ml-10 bg-secondary-background rounded-md border border-border'>
                            <div className='py-3 px-5 flex items-center gap-3 relative'>
                                <SiTypescript /><code className=''>app/layout.tsx</code>
                                <CopyButton text={code.join("\n")}
                                    className="absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer hover:text-success transition-all" />
                            </div>
                            <div className="py-3 bg-soft-background border-t-2 border-border">
                                {code.map((line, index) => (
                                    <div key={index} className="whitespace-pre border-l-4 pl-5 border-transparent " style={{
                                        backgroundColor: index == 0 || index == 13 ? "var(--color-blue-highlight-background)" : "transparent",
                                        borderColor: index == 0 || index == 13 ? "var(--color-blue-highlight)" : "transparent"
                                    }}>
                                        <code>{line}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
