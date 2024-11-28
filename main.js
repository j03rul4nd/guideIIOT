    import * as THREE from "three";

    // Escena y cámara
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Geometría del plano
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Material del shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_time: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;

        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);

          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));

          vec2 u = f * f * (3.0 - 2.0 * f);

          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          vec2 shift = vec2(100.0);
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(st);
            st = st * 2.0 + shift;
            amplitude *= 0.5;
          }
          return value;
        }

        float circularGradient(vec2 st, vec2 center, float radius, float softness) {
          float d = distance(st, center);
          return smoothstep(radius + softness, radius - softness, d);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;

          vec3 color1 = vec3(0.9, 0.4, 0.7);
          vec3 color2 = vec3(0.5, 0.7, 0.95);
          vec3 color3 = vec3(1.0, 0.8, 0.9);

          vec3 baseGradient = mix(color1, color2, st.y);

          float n = fbm(st * 3.0 + u_time * 0.2);

          float radial = circularGradient(st, vec2(0.5, 0.5), 0.5, 0.3);
          vec3 finalColor = mix(baseGradient, color3, n * radial);

          float shadow = smoothstep(0.3, 0.6, st.y - st.x * 0.7) * 0.5;
          finalColor -= shadow;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Manejar el cambio de tamaño
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });

    // Bucle de animación
    const clock = new THREE.Clock();
    function animate() {
      material.uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();



// #region uicontrols
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1); // Obtiene el ID del destino
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // Desplazamiento suave
        block: 'start' // Alinea al inicio de la sección
      });
    }
  });
});

// Seleccionar el botón por su ID
document.getElementById("btn-tutorial").addEventListener("click", function() {
  // Abrir el video de Vimeo en una nueva pestaña
  window.open("https://vimeo.com/1034195872/947b8ed6f1?share=copy", "_blank");
});



document.getElementById("btnSubToNewsletter")?.addEventListener("click", async ()=>{
  let user = "user for guide iot";
  let correo = document.getElementById("emailinput")?.value;
  let msg = `this user suscribed ${correo}`;

  // Verificar que los campos no estén vacíos, nulos o indefinidos
  if (correo !== undefined && correo !== null && correo.trim() !== "" &&
      msg !== undefined && msg !== null && msg.trim() !== "") {
      
          var button = document.getElementById("btnSubToNewsletter");

          // Agrega la clase shake para la animación
          button.classList.add('shake');
        
          // Cambia el texto del botón después de la animación
          setTimeout(function() {
              button.innerText = 'Suscribed!';
              // Remueve la clase shake después de la animación para que pueda reutilizarse
              button.classList.remove('shake');
          }, 500); // 500ms debe coincidir con la duración de la animación en CSS
      
          const res = await fetch('https://backendsendemailportfolio.onrender.com/send-email', {
          method: "POST",
          headers: {
              "content-type": "application/json",
          },
          body: JSON.stringify({
              from: correo, // 'onboarding@resend.dev',
              to: 'joelbenitezdonari@gmail.com',
              subject: `${user} | Services`,
              html: `<p> ${msg} <strong>email frontend</strong>!</p>`,
              text: "hi, joel new suscriber"
          })
          
      });

      button.setAttribute('send', 'true'); 
      const responseData = await res.json();
          console.log(responseData);
  } else {
      console.log("Todos los campos son obligatorios");
  }

})


// #endregion