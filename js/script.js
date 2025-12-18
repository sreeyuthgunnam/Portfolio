// Small JS helpers: typewriter, reveal on scroll, mobile nav toggle, year
const roles = ["Software Developer.", "Computer Science Student."]
let roleIdx = 0
const roleEl = document.getElementById('role')
const yearEl = document.getElementById('year')
const resumeLink = document.getElementById('resume-link')

function typeRole(text, el, cb){
  el.textContent = ''
  let i = 0
  const speed = 60
  function step(){
    if(i < text.length){
      el.textContent += text[i++]
      setTimeout(step, speed)
    } else {
      setTimeout(()=> cb && cb(), 900)
    }
  }
  step()
}

function cycleRoles(){
  typeRole(roles[roleIdx], roleEl, ()=>{
    // erase
    setTimeout(()=>{
      const current = roles[roleIdx]
      let j = current.length
      const eraseSpeed = 30
      function erase(){
        if(j>=0){
          roleEl.textContent = current.slice(0,j--)
          setTimeout(erase, eraseSpeed)
        } else {
          roleIdx = (roleIdx+1) % roles.length
          cycleRoles()
        }
      }
      erase()
    }, 1200)
  })
}

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible')
      observer.unobserve(e.target)
    }
  })
},{threshold:0.12})

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))

// Mobile nav
const navToggle = document.getElementById('nav-toggle')
const nav = document.getElementById('nav')
navToggle && navToggle.addEventListener('click', ()=>{
  nav.classList.toggle('open')
})

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href')
    if(href.length>1){
      e.preventDefault()
      document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'})
      if(nav.classList.contains('open')) nav.classList.remove('open')
    }
  })
})

// Init
yearEl && (yearEl.textContent = new Date().getFullYear())
if(roleEl) cycleRoles()

// Navbar hide on scroll down, show on scroll up
let lastScrollY = window.scrollY
const header = document.querySelector('.site-header')
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    header.classList.add('hidden')
  } else {
    header.classList.remove('hidden')
  }
  lastScrollY = currentScrollY
})

// Progressive enhancement: if resume file not present, hide download button gracefully
fetch('./resume/Resume.pdf', {method:'HEAD'}).then(res=>{
  if(!res.ok && resumeLink) resumeLink.style.display = 'none'
}).catch(()=>{
  // ignore network errors; leave button hidden if file absent
  if(resumeLink) resumeLink.style.display = 'none'
})
