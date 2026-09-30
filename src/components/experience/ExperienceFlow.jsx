import EnvelopeStep from './EnvelopeStep';
import ScrapbookStep from './ScrapbookStep';
import CakeCandleStep from './CakeCandleStep';
import ScratchGiftsStep from './ScratchGiftsStep';

export default function ExperienceFlow({ currentStep, setCurrentStep, wishData, onOpenCreator }) {
  // Only birthday and anniversary occasions display the cake/candle milestone step
  const isMilestoneOccasion = wishData.occasion === 'birthday' || wishData.occasion === 'anniversary';
  const isFestival = wishData.occasion === 'festival';

  return (
    <div className="w-full flex flex-col items-center">
      {currentStep === 1 && (
        <EnvelopeStep
          wishData={wishData}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <ScrapbookStep
          wishData={wishData}
          // If it's a festival, skip step 3 entirely and go straight to step 4 (Gifts)
          onNext={() => setCurrentStep(isMilestoneOccasion ? 3 : 4)}
          onBack={() => setCurrentStep(1)}
          isFestival={isFestival}
        />
      )}

      {currentStep === 3 && isMilestoneOccasion && (
        <CakeCandleStep
          wishData={wishData}
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <ScratchGiftsStep
          wishData={wishData}
          onBack={() => setCurrentStep(isMilestoneOccasion ? 3 : 2)}
          onOpenCreator={onOpenCreator}
        />
      )}
    </div>
  );
}