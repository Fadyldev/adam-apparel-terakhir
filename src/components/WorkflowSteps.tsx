import { motion } from 'framer-motion';
import { ClipboardList, Factory, PackageCheck, Ruler, Truck, ChevronRight, Scissors } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardList,
    title: '1. Isi SPK Online',
    text: 'Pilih model, kain, & rincian ukuran di kalkulator digital.',
  },
  {
    icon: Ruler,
    title: '2. ACC Desain & DP',
    text: 'Konfirmasi uang muka 50% & preview bordir/sablon.',
  },
  {
    icon: Factory,
    title: '3. Cutting & Jahit',
    text: 'Pola dipotong presisi, bordir komputer, & jahit rantai distro.',
  },
  {
    icon: PackageCheck,
    title: '4. QC & Pelunasan',
    text: 'Inspeksi setiap pcs bebas cacat, lalu verifikasi sisa 50%.',
  },
  {
    icon: Truck,
    title: '5. Ekspedisi Aman',
    text: 'Kirim via kargo ke seluruh Indonesia dengan garansi retur.',
  },
];

export default function WorkflowSteps() {
  return (
    <section id="alur-spk" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 py-14 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Scissors className="h-3.5 w-3.5 text-amber-600 -rotate-45" />
            SOP Alur Pemesanan Konveksi Resmi
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            5 Langkah Mudah dari Form SPK Sampai Seragam Jadi
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          Alur Jahit Terstandarisasi Garmen
        </div>
      </div>

      {/* Horizontal Stepper with Glowing Stitch Line */}
      <div className="relative mt-10">
        {/* Animated Stitch Line (Connecting Desktop Grid) */}
        <div className="hidden sm:block absolute top-[44px] inset-x-8 h-1 z-0 overflow-hidden pointer-events-none">
          {/* Base dashed stitch line */}
          <div className="w-full h-full border-t-2 border-dashed border-amber-300/60" />
          {/* Animated stitch traveling pulse */}
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
            className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent blur-[1px]"
          />
        </div>

        <ol className="relative z-10 flex items-stretch gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:pb-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;
            return (
              <motion.li
                key={step.title}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex w-[230px] xs:w-[260px] shrink-0 snap-center flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-amber-400 hover:shadow-lg sm:w-auto"
              >
                {/* Step Top Header */}
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-md group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-extrabold text-amber-900 group-hover:bg-amber-100 transition-colors">
                    Tahap {index + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-slate-900 sm:text-base group-hover:text-amber-800 transition-colors">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {step.text}
                </p>

                {/* Animated Arrow Connector (Desktop) */}
                {!isLast && (
                  <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 items-center justify-center rounded-full bg-white border border-amber-300 shadow-md text-amber-600 group-hover:border-amber-500 group-hover:text-amber-700">
                    <motion.div
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    >
                      <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </motion.div>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
