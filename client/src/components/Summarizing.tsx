import ShinyText from "./ReactBits/TextAnimations/ShinyText/ShinyText";

const Summarizing: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 flex h-svh w-svw items-center justify-center text-center">
            <ShinyText text="Summarizing..." speed={3} className="text-2xl" />
        </div>
    );
};

export default Summarizing;
