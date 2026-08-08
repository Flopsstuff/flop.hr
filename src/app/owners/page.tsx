import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface Owner {
  name: string;
  link_text?: string;
  link_href?: string;
  description?: string;
}

// Date of the last commit that touched the file. A fresh CI clone resets every
// mtime to checkout time, so the file date is only a fallback.
function lastCommitDate(filePath: string): string {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', filePath], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (date) return date;
  } catch {
    // no git in the build environment
  }
  return fs.statSync(filePath).mtime.toISOString().split('T')[0];
}

export default async function Owners() {
  // Read file from filesystem
  const filePath = path.join(process.cwd(), 'public', 'owners.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const owners: Owner[] = JSON.parse(fileContent);

  const lastUpdate = lastCommitDate(filePath);

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <main className="flex flex-col items-center justify-start flex-grow">
      <section className="w-full flex flex-col md:flex-row items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              <Link href="/" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">
                FlopCoin
              </Link> owners
            </h1>
          </div>
        </section>

        <section className="w-full flex flex-col md:flex-row items-center gap-6 bg-gray-100 dark:bg-gray-900 p-4 rounded">
          <div className="order-2 md:order-1 flex-grow">
            <h2 className="text-2xl font-bold mb-3">List of FlopCoin owners:</h2>

            <ul className="list-disc pl-5 mb-2">
              {owners.map((owner, index) => (
                <li key={index}>
                  <strong>{owner.name}</strong>&nbsp;&nbsp;
                  {owner.link_text && owner.link_href ? (
                    <a href={owner.link_href} className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                      {owner.link_text}
                    </a>
                  ) : null} {owner.description ? <span>{owner.description}</span> : null}
                </li>
              ))}
            </ul>
            <p>Last update: {lastUpdate}</p>
          </div>
        </section>

        <section className="w-full flex flex-col md:flex-row items-center gap-6 bg-gray-200 dark:bg-gray-800 p-4 rounded">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-3">Want to be on this list?</h2>
            <p className="mb-2">Fill out <a href="https://forms.gle/5xEeyVDAHdSDsLGD6" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">this form</a> with a photo of you and your FlopCoin </p>
            <h2 className="text-1xl font-bold mb-2">Want to remove yourself from this list?</h2>
            <p>Please contact Flop directly</p>
          </div>
        </section>
      </main>
      <footer className="text-center text-gray-500 text-sm py-4">
        (c) 2025 FlopCoin.art
      </footer>
    </div>
  );
}

