import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

const photoSizes = '(min-width: 768px) 24rem, 90vw';

export default function Home() {
  return (
    <main className="mx-auto max-w-content px-5 pb-20 sm:px-8">
      <section className="pt-12 pb-4 sm:pt-16">
        <Reveal>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Hi there! You&apos;re probably on this website because you own at least one FlopCoin.
          </h1>
        </Reveal>
      </section>

      <div className="space-y-6 md:space-y-8">
        <Reveal delay={40}>
          <section className="card grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
            <div className="photo-frame relative aspect-square w-full max-w-sm md:order-2 md:mx-auto">
              <Image src="/s1.jpg" alt="FlopCoin" fill sizes={photoSizes} className="object-cover" priority />
            </div>
            <div className="space-y-3 leading-relaxed md:order-1">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">What is a FlopCoin?</h2>
              <p>FlopCoin (Flop.hr) is a physical embodiment of <strong>one hour of Flop&apos;s time</strong> — one hour of his life.</p>
              <p>Owning a FlopCoin means you hold a <strong>public promise</strong> from Flop to dedicate one full hour of his time to fulfilling your request.<br />
              When redeemed, this request takes priority over Flop&apos;s personal interests or plans.</p>
              <p>Additionally, each FlopCoin is a <strong>unique art object</strong> and a <strong>rare artifact</strong>.<br />
              There was only <strong>one issuance</strong> of FlopCoins, and there are around <strong>100 unique coins</strong> in existence. Some have already been used.</p>
              <p>Some of the lucky FlopCoin owners are featured <Link href="/owners" className="link">here</Link></p>
              <p className="pt-1"><strong>Q: How can you I get a FlopCoin?</strong></p>
              <p><strong>A:</strong> The only way is if one of the <Link href="/owners" className="link">owners</Link> agrees to give it to you, gift it, or sell it.</p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <section className="card grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
            <div className="photo-frame relative aspect-square w-full max-w-sm md:mx-auto">
              <Image src="/s2.jpg" alt="FlopCoin usage" fill sizes={photoSizes} className="object-cover" />
            </div>
            <div className="space-y-3 leading-relaxed">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">How can you use a FlopCoin?</h2>
              <p>First, you need to know who Flop is and have a way to contact him.</p>
              <p>You must be in the same space-time location as Flop. Then, send him a message starting with:<br />
              <strong>&quot;I want…&quot;</strong> and attach a photo as proof that you possess a FlopCoin.</p>
              <p>After that, you&apos;ll agree on the <strong>details</strong>: where, when, and how the request will be fulfilled. You&apos;ll need to meet up to redeem the coin.</p>
              <p>In <strong>special or emergency situations</strong>, you can use the FlopCoin to ask Flop <strong>to stop doing something immediately</strong> — effectively pausing his activity for a full hour.</p>
              <p>You can also <strong>gift</strong> your FlopCoin, <strong>sell</strong> it on a marketplace, or <strong>keep it as a valuable souvenir</strong>.</p>
              <p>Yes, you can pawn FlopCoin or take it to a scrap metal dealer. It is made of 99.99% pure silver.</p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <section className="card grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
            <div className="photo-frame relative aspect-square w-full max-w-sm md:order-2 md:mx-auto">
              <Image src="/s3.jpg" alt="FlopCoin examples" fill sizes={photoSizes} className="object-cover" />
            </div>
            <div className="space-y-3 leading-relaxed md:order-1">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Examples of how to use a FlopCoin:</h2>
              <p>You could ask Flop to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Cook breakfast</li>
                <li>Walk your dog</li>
                <li>Fix your computer</li>
                <li>Give you a massage</li>
                <li>Paint a fence</li>
              </ul>
              <p>Here are a few <strong>real examples</strong> of how FlopCoins have already been used:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Flop ran non-stop for an hour</li>
                <li>Flop distributed flyers to help rehome a kitten</li>
                <li>Flop spent an hour as a submissive at a themed party</li>
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <section className="card grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
            <div className="photo-frame relative aspect-square w-full max-w-sm md:mx-auto">
              <Image src="/s4.jpg" alt="FlopCoin limitations" fill sizes={photoSizes} className="object-cover" />
            </div>
            <div className="space-y-3 leading-relaxed">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">What can&apos;t you do with a FlopCoin?</h2>
              <p>Obviously, you <strong>cannot</strong> use a FlopCoin to force Flop to break the <strong>law</strong>, <strong>civil codes</strong>, <strong>regulations</strong>, or <strong>common moral standards</strong>.<br />
              For example, you <strong>cannot</strong> make him rob an old lady or beat up your ex.</p>
              <p>Also, FlopCoin <strong>is not a currency</strong> — no physical or digital entity in the world accepts it as a payment method.</p>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
