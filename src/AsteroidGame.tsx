import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GameCanvas = styled.canvas`
  border: 1px solid #00ff00;
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
`;

interface GameObject {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

interface Ship extends GameObject {
  rotation: number;
}

interface Bullet extends GameObject {
  lifespan: number;
}

const AsteroidGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const ship: Ship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      dx: 0,
      dy: 0,
      rotation: 0,
    };

    const asteroids: GameObject[] = [];
    const bullets: Bullet[] = [];

    function createAsteroid() {
      const asteroid: GameObject = {
        x: Math.random() * canvas.width,
        y: Math.random() < 0.5 ? 0 : canvas.height,
        radius: 20 + Math.random() * 20,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
      };
      asteroids.push(asteroid);
    }

    function drawShip() {
      if (!ctx) return;
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.rotation);
      ctx.beginPath();
      ctx.moveTo(0, -ship.radius);
      ctx.lineTo(-ship.radius, ship.radius);
      ctx.lineTo(ship.radius, ship.radius);
      ctx.closePath();
      ctx.strokeStyle = '#00ff00';
      ctx.stroke();
      ctx.restore();
    }

    function drawAsteroids() {
      if (!ctx) return;
      asteroids.forEach((asteroid) => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
      });
    }

    function drawBullets() {
      if (!ctx) return;
      bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
      });
    }

    function fireBullet() {
      const bullet: Bullet = {
        x: ship.x + Math.cos(ship.rotation) * ship.radius,
        y: ship.y + Math.sin(ship.rotation) * ship.radius,
        radius: 3,
        dx: Math.cos(ship.rotation) * 10,
        dy: Math.sin(ship.rotation) * 10,
        lifespan: 60, // frames
      };
      bullets.push(bullet);
    }

    function checkCollisions() {
      // Check ship-asteroid collisions
      for (let asteroid of asteroids) {
        const dx = ship.x - asteroid.x;
        const dy = ship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ship.radius + asteroid.radius) {
          setGameOver(true);
          return;
        }
      }

      // Check bullet-asteroid collisions
      for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
          const dx = bullets[i].x - asteroids[j].x;
          const dy = bullets[i].y - asteroids[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < bullets[i].radius + asteroids[j].radius) {
            asteroids.splice(j, 1);
            bullets.splice(i, 1);
            setScore((prevScore) => prevScore + 10);
            break;
          }
        }
      }
    }

    function updateGame() {
      if (!ctx || !canvas || gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ship.x += ship.dx;
      ship.y += ship.dy;

      if (ship.x < 0) ship.x = canvas.width;
      if (ship.x > canvas.width) ship.x = 0;
      if (ship.y < 0) ship.y = canvas.height;
      if (ship.y > canvas.height) ship.y = 0;

      asteroids.forEach((asteroid) => {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;

        if (asteroid.x < -asteroid.radius) asteroid.x = canvas.width + asteroid.radius;
        if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = -asteroid.radius;
        if (asteroid.y < -asteroid.radius) asteroid.y = canvas.height + asteroid.radius;
        if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = -asteroid.radius;
      });

      bullets.forEach((bullet, index) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        bullet.lifespan--;
        if (bullet.lifespan <= 0) {
          bullets.splice(index, 1);
        }
      });

      checkCollisions();
      drawShip();
      drawAsteroids();
      drawBullets();

      if (asteroids.length < 5) {
        createAsteroid();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') ship.rotation -= 0.1;
      if (e.key === 'ArrowRight') ship.rotation += 0.1;
      if (e.key === 'ArrowUp') {
        ship.dx += Math.cos(ship.rotation) * 0.1;
        ship.dy += Math.sin(ship.rotation) * 0.1;
      }
      if (e.key === ' ') fireBullet();
    });

    for (let i = 0; i < 5; i++) {
      createAsteroid();
    }

    const gameLoop = setInterval(updateGame, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      document.removeEventListener('keydown', (e) => {});
    };
  }, [gameOver]);

  return (
    <div style={{ position: 'relative' }}>
      <GameCanvas ref={canvasRef} />
      <GameOverlay>
        <div>Score: {score}</div>
        {gameOver && <div>Game Over!</div>}
      </GameOverlay>
    </div>
  );
};

export default AsteroidGame;