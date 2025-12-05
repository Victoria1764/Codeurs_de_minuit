// Fichier : script.js (Logique complète du Quiz et des Filtres de Recherche)

document.addEventListener('DOMContentLoaded', () => {

    const quizDiv = document.getElementById('quiz');
    const submitButton = document.getElementById('submit-btn');
    const resultsDiv = document.getElementById('results');

    // Vérifie si les éléments du QUIZ sont présents sur la page (pour éviter les erreurs sur les autres pages)
    if (quizDiv && submitButton && resultsDiv) {
        
        // --- LES TROIS NIVEAUX DE QUESTIONS (DATA) ---
        const quizzes = {
            facile: [
                {
                    question: "Quel est le principe fondamental du logiciel Open Source ?",
                    answers: { a: "Son code est secret et protégé.", b: "Son code est public et modifiable par tous.", c: "Il est toujours payant." },
                    correctAnswer: "b"
                },
                {
                    question: "Quel est l'équivalent Open Source de Microsoft Office Word ?",
                    answers: { a: "Firefox", b: "Writer (de LibreOffice)", c: "GIMP" },
                    correctAnswer: "b"
                },
                {
                    question: "L'aspect 'Inclusif' de la NIRD encourage l'utilisation de logiciels...",
                    answers: { a: "payants et exclusifs.", b: "gratuits et accessibles à tous." },
                    correctAnswer: "b"
                }
            ],
            moyen: [
                {
                    question: "Quel terme désigne la licence qui garantit que les améliorations d'un code libre restent libres ?",
                    answers: { a: "Licence MIT", b: "Licence Copyright", c: "Licence GPL (Copyleft)" },
                    correctAnswer: "c"
                },
                {
                    question: "Quel est l'impact de l'éco-conception logicielle (NIRD Durable) sur le matériel ?",
                    answers: { a: "Cela force l'achat de nouveaux ordinateurs.", b: "Cela prolonge la durée de vie des anciens PC.", c: "Aucun impact." },
                    correctAnswer: "b"
                },
            ],
            difficile: [
                {
                    question: "Quel service Open Source est une alternative responsable à Google Drive pour le stockage ?",
                    answers: { a: "Dropbox", b: "Nextcloud", c: "Amazon S3" },
                    correctAnswer: "b"
                },
                {
                    question: "Le principe 'Responsable' de la NIRD est lié à quelle liberté fondamentale de l'Open Source ?",
                    answers: { a: "La liberté de redistribuer le logiciel.", b: "La liberté d'étudier et d'auditer le code source.", c: "La liberté d'installer le logiciel sur un seul poste." },
                    correctAnswer: "b"
                },
            ]
        };

        let currentLevel = 'facile';
        let currentQuestionIndex = 0;
        let score = 0;
        let questionsAnswered = {}; // Pour suivre les réponses de l'utilisateur
        let quizStarted = false; // Nouvel état pour gérer le premier clic

        // --- FONCTION PRINCIPALE D'AFFICHAGE DU QUIZ ---

        function showQuestion(level, index) {
            quizDiv.innerHTML = ''; // Nettoie le contenu précédent
            submitButton.textContent = "Question Suivante";
            submitButton.disabled = true; // IMPORTANT : Désactiver au changement de question

            const currentQuiz = quizzes[level];
            const q = currentQuiz[index];
            const numTotalQuestions = currentQuiz.length;

            if (!q) return;

            // Détermine le texte du bouton Soumettre si c'est la dernière question
            if (index === numTotalQuestions - 1 && level === 'difficile') {
                 submitButton.textContent = "Soumettre le Quiz !";
            } else if (index === numTotalQuestions - 1) {
                 submitButton.textContent = "Passer au Niveau Suivant";
            }
            
            // Création du titre du niveau
            const levelTitle = document.createElement('h2');
            levelTitle.classList.add('quiz-level-title');
            levelTitle.textContent = `Niveau ${level.charAt(0).toUpperCase() + level.slice(1)} (${index + 1}/${numTotalQuestions})`;
            quizDiv.appendChild(levelTitle);


            // Création de la carte de question
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');
            
            const questionText = document.createElement('div');
            questionText.classList.add('question');
            questionText.textContent = q.question;
            questionCard.appendChild(questionText);

            const answersDiv = document.createElement('div');
            answersDiv.classList.add('answers');

            // Affichage des réponses
            for (let letter in q.answers) {
                if (q.answers.hasOwnProperty(letter)) {
                    const answerDiv = document.createElement('div');
                    answerDiv.setAttribute('data-answer', letter);
                    // Nous n'utilisons plus les inputs radio visiblement, mais ils sont conservés pour la soumission
                    answerDiv.innerHTML = `<input type="radio" name="question-${level}-${index}" id="${level}-${index}-${letter}" value="${letter}" style="display:none;">
                                           <label for="${level}-${index}-${letter}">${letter.toUpperCase()}. ${q.answers[letter]}</label>`;
                    answersDiv.appendChild(answerDiv);
                }
            }

            questionCard.appendChild(answersDiv);
            quizDiv.appendChild(questionCard);

            // Gère la SELECTION et active le bouton
            addAnswerListeners(level, index);
        }

        // --- GESTION DE LA SÉLECTION DES RÉPONSES (CORRIGÉE) ---

        function addAnswerListeners(level, index) {
            const answerOptions = quizDiv.querySelectorAll('.answers div');

            // Écouteur pour la carte de réponse (pour l'effet visuel)
            answerOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // Désélectionne visuellement toutes les options
                    answerOptions.forEach(opt => opt.classList.remove('selected'));
                    
                    // Sélectionne visuellement l'option cliquée (PASSE EN VERT GRÂCE AU CSS)
                    this.classList.add('selected');
                    
                    // Coche le bouton radio correspondant (caché)
                    const radio = this.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.checked = true;
                    }
                    
                    // Stocke la réponse sélectionnée et active le bouton Suivant
                    questionsAnswered[`${level}-${index}`] = this.getAttribute('data-answer');
                    submitButton.disabled = false;
                });
            });
        }
        
        // --- LOGIQUE DE NAVIGATION (BOUTON SUBMIT) (MIS À JOUR) ---

        submitButton.addEventListener('click', () => {
            if (!quizStarted) {
                // Gestion du premier clic "Démarrer le Quiz"
                quizStarted = true;
                showQuestion(currentLevel, currentQuestionIndex);
                return; // Sortir après le démarrage pour éviter la double action
            }
            
            // Vérifie qu'une réponse a été sélectionnée (sécurité)
            if (submitButton.disabled) {
                alert("Veuillez sélectionner une réponse avant de continuer.");
                return;
            }
            
            const currentQuiz = quizzes[currentLevel];
            const numTotalQuestions = currentQuiz.length;

            // 1. Calculer le score pour la question actuelle
            checkAnswer(currentLevel, currentQuestionIndex);

            // 2. Vérifier si c'est la dernière question du niveau
            if (currentQuestionIndex === numTotalQuestions - 1) {
                
                let nextLevel;
                if (currentLevel === 'facile') {
                    nextLevel = 'moyen';
                } else if (currentLevel === 'moyen') {
                    nextLevel = 'difficile';
                } else {
                    nextLevel = null; // Fin du quiz
                }
                
                // Afficher l'écran de transition/résultats
                if (nextLevel) {
                    showTransitionScreen(nextLevel);
                } else {
                    showFinalResults();
                }

            } else {
                // 3. Passer à la question suivante
                currentQuestionIndex++;
                showQuestion(currentLevel, currentQuestionIndex);
            }
        });

        // --- AFFICHAGE ÉCRAN DE TRANSITION ---
        
        function showTransitionScreen(nextLevel) {
            quizDiv.innerHTML = `
                <div class="transition-screen">
                    <h2>Niveau ${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Terminé !</h2>
                    <p>Bravo ! Préparez-vous à affronter le **Niveau ${nextLevel.toUpperCase()}** !</p>
                    <button id="start-next-level-btn" class="cta-link" style="width: 250px; margin: 20px auto;">Commencer le Niveau Suivant</button>
                </div>
            `;
            submitButton.style.display = 'none';
            resultsDiv.style.display = 'none';
            
            document.getElementById('start-next-level-btn').addEventListener('click', () => {
                currentLevel = nextLevel;
                currentQuestionIndex = 0;
                submitButton.style.display = 'block';
                showQuestion(currentLevel, currentQuestionIndex);
            });
        }

        // --- VÉRIFICATION DE LA RÉPONSE ---

        function checkAnswer(level, index) {
            const q = quizzes[level][index];
            const userAnswer = questionsAnswered[`${level}-${index}`];

            if (userAnswer === q.correctAnswer) {
                score++;
            }
        }
        
        // --- AFFICHAGE DES RÉSULTATS FINAUX ---

        function showFinalResults() {
            quizDiv.innerHTML = '';
            submitButton.style.display = 'none';
            resultsDiv.style.display = 'block';

            const totalQuestions = quizzes.facile.length + quizzes.moyen.length + quizzes.difficile.length;
            const percentage = Math.round((score / totalQuestions) * 100);

            let message = '';
            if (percentage >= 80) {
                message = "Félicitations ! Vous êtes un expert Open Source !";
            } else if (percentage >= 50) {
                message = "Bon travail ! Vous avez une bonne base, continuez à explorer le contenu NIRD.";
            } else {
                message = "Vous avez encore des choses à apprendre. Revoyez la section Contenu pour devenir un résistant numérique !";
            }

            resultsDiv.innerHTML = `
                <h2>Quiz Terminé !</h2>
                <p>Votre score final est de **${score}** / **${totalQuestions}** (${percentage}%)</p>
                <p>${message}</p>
                <button id="restart-btn" class="cta-link" style="width: 200px; margin: 20px auto;">Recommencer</button>
            `;
            
            document.getElementById('restart-btn').addEventListener('click', () => {
                window.location.reload();
            });
        }


        // --- INITIALISATION AU CHARGEMENT DE LA PAGE ---
        
        // Le bouton "Démarrer le Quiz" est actif par défaut
        submitButton.textContent = "Démarrer le Quiz";
        submitButton.disabled = false;

    } 
    
    // ======================================================================
    // ===== LOGIQUE DES FILTRES DE RECHERCHE (Ressources) =====
    // ======================================================================

    const searchInput = document.getElementById('searchInput');
    const ressourcesList = document.getElementById('ressourcesList');
    const filterButtons = document.querySelectorAll('.filtres-boutons button');

    if (searchInput && ressourcesList && filterButtons.length > 0) {
        
        function filterRessources(query, theme) {
            const normalizedQuery = query.toLowerCase().trim();
            const items = ressourcesList.querySelectorAll('li');

            for (const item of items) {
                const itemText = item.textContent.toLowerCase();
                const itemThemes = item.getAttribute('data-themes')?.toLowerCase().split(' ') || [];
                
                const matchesQuery = itemText.includes(normalizedQuery);
                const matchesTheme = !theme || itemThemes.includes(theme);

                if (matchesQuery && matchesTheme) {
                    item.style.display = ''; // Affiche l'élément
                } else {
                    item.style.display = 'none'; // Masque l'élément
                }
            }
        }

        // Écouteur pour la saisie (Recherche en direct)
        searchInput.addEventListener('keyup', (e) => {
            const activeFilter = document.querySelector('.filtres-boutons button.active-toggle')?.getAttribute('data-filtre') || '';
            filterRessources(e.target.value, activeFilter);
        });

        // Écouteur pour les Boutons Filtres
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedFilter = e.target.getAttribute('data-filtre');
                const isCurrentlyActive = e.target.classList.contains('active-toggle');
                
                // Réinitialiser tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active-toggle'));

                let filterToApply = '';

                // Si le bouton n'était PAS actif, l'activer et appliquer le filtre
                if (!isCurrentlyActive) {
                    e.target.classList.add('active-toggle');
                    filterToApply = selectedFilter;
                } 

                filterRessources(searchInput.value, filterToApply);
            });
        });

         // Initialisation : Afficher toutes les ressources au chargement
         filterRessources('', '');
    }
});