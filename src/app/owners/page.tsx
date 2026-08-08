import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

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
    <main className="mx-auto max-w-content px-5 pb-20 sm:px-8">
      <section className="pt-12 pb-4 sm:pt-16">
        <Reveal>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <Link href="/" className="link">
              FlopCoin
            </Link>{' '}
            owners
          </h1>
        </Reveal>
      </section>

      <div className="space-y-6 md:space-y-8">
        <Reveal delay={40}>
          <section className="card p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">Some of FlopCoin owners:</h2>

            <ul className="divide-y divide-line">
              {owners.map((owner, index) => (
                <li key={index} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-3">
                  <strong className="font-semibold">{owner.name}</strong>
                  {owner.link_text && owner.link_href ? (
                    <a href={owner.link_href} className="link text-sm" target="_blank" rel="noopener noreferrer">
                      {owner.link_text}
                    </a>
                  ) : null}
                  {owner.description ? <span className="text-fg-muted">{owner.description}</span> : null}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-fg-muted">Last update: {lastUpdate}</p>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <section className="card space-y-3 p-6 md:p-8">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Want to be on this list?</h2>
            <p>Fill out <a href="https://forms.gle/5xEeyVDAHdSDsLGD6" className="link">this form</a> with a photo of you and your FlopCoin </p>
            <h2 className="pt-1 text-lg font-semibold tracking-tight">Want to remove yourself from this list?</h2>
            <p>Please contact Flop directly</p>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
