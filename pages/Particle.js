import Particles from "react-tsparticles";

const Particle = () => {
  return (
    <Particles
      width="100vw"
      height="100vh"
      id="tsparticles"
      options={{
        background: {
          color: "#000",
        },
        detectRetina: true,
        fpsLimit: 60,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              parallax: { enable: true, force: 20, smooth: 20 },
              mode: "trail",
              enable: true,
            },
          },
          modes: {
            trail: {
              delay: 0.005,
              quantity: 5,
              particles: {
                color: {
                  value: "#ff0000",
                  animation: {
                    enable: true,
                    speed: 400,
                    sync: true,
                  },
                },
                collisions: {
                  enable: false,
                },
                links: {
                  enable: false,
                },
                move: {
                  outMode: "destroy",
                  speed: 5,
                },
                size: {
                  value: 5,
                  animation: {
                    enable: true,
                    speed: 5,
                    minimumValue: 1,
                    sync: true,
                    startValue: "min",
                    destroy: "max",
                  },
                },
              },
            },
          },
          resize: true,
        },
        motion: {
          reduce: {
            value: true,
          },
        },
        particles: {
          color: {
            animation: {
              enable: true,
              sync: false,
              speed: 50,
            },
            value: "#f00",
          },
          links: {
            color: "random",
            enable: true,
          },
          collisions: {
            enable: true,
          },
          move: {
            enable: true,
          },
          number: {
            density: {
              enable: true,
            },
          },
          opacity: {
            animation: {
              enable: true,
              minimumValue: 0.3,
              speed: 0.5,
            },
            value: 0.8,
            random: {
              enable: true,
              minimumValue: 0.3,
            },
          },
          size: {
            animation: {
              enable: true,
              minimumValue: 1,
              speed: 3,
            },
            value: 3,
            random: {
              enable: true,
              minimumValue: 1,
            },
          },
        },
      }}
    />
  );
};

export default Particle;
