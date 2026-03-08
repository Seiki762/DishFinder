// Sample dish data (you can add more later)
const dishes = [
    {
        name: "Chicken Stir Fry",
        cuisine: "Asian",
        ingredients: "chicken, soy sauce, garlic, ginger, vegetables, oil",
        steps: "1. Heat oil in pan.\n2. Add chicken and cook until browned.\n3. Add garlic, ginger, vegetables.\n4. Pour soy sauce and stir-fry until done.",
        image_url: "https://via.placeholder.com/400x250?text=Stir+Fry"
    },
    {
        name: "Spaghetti Carbonara",
        cuisine: "Italian",
        ingredients: "pasta, eggs, bacon, parmesan, black pepper",
        steps: "1. Cook pasta.\n2. Fry bacon until crispy.\n3. Mix eggs and parmesan.\n4. Toss with hot pasta and bacon.",
        image_url: "https://via.placeholder.com/400x250?text=Carbonara"
    },
    {
        name: "Tacos",
        cuisine: "Mexican",
        ingredients: "tortillas, ground beef, lettuce, tomato, cheese, salsa",
        steps: "1. Cook ground beef.\n2. Warm tortillas.\n3. Add beef, lettuce, tomato, cheese, salsa.\n4. Serve immediately.",
        image_url: "https://via.placeholder.com/400x250?text=Tacos"
    }
];

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const ingredientsInput = document.getElementById('ingredients').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!ingredientsInput) {
        resultsDiv.innerHTML = '<p style="color: #b34a34; text-align: center;">Please enter at least one ingredient.</p>';
        return;
    }
    
    resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Searching...</p>';
    
    // Normalize input
    const userIngredients = ingredientsInput.toLowerCase().replace(/\s+/g, ' ').trim();
    const userArray = userIngredients.split(',').map(ing => ing.trim()).filter(ing => ing);
    
    let matches = [];
    
    dishes.forEach(dish => {
        const dishIngredients = dish.ingredients.toLowerCase().split(',').map(ing => ing.trim()).filter(ing => ing);
        const matchedCount = userArray.filter(ing => dishIngredients.includes(ing)).length;
        const totalRequired = dishIngredients.length;
        const matchPercentage = (matchedCount / totalRequired) * 100;
        const missing = dishIngredients.filter(ing => !userArray.includes(ing));
        
        if (matchPercentage >= 50) { // Minimum 50% match
            matches.push({
                name: dish.name,
                cuisine: dish.cuisine,
                match_percentage: Math.round(matchPercentage),
                missing_ingredients: missing,
                match_type: matchPercentage === 100 ? 'Exact Match' : 'Close Match',
                steps: dish.steps,
                image_url: dish.image_url
            });
        }
    });
    
    // Sort: Exact matches first, then by percentage
    matches.sort((a, b) => {
        if (a.match_type === 'Exact Match' && b.match_type !== 'Exact Match') return -1;
        if (a.match_type !== 'Exact Match' && b.match_type === 'Exact Match') return 1;
        return b.match_percentage - a.match_percentage;
    });
    
    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">No dishes found with those ingredients. Try adding more or using simpler terms!</p>';
        return;
    }
    
    let html = '';
    matches.forEach(dish => {
        const missingChips = dish.missing_ingredients.map(ing => 
            `<span class="missing-chip" title="You don't have this ingredient">${ing}</span>`
        ).join('');
        
        html += `
        <div class="result-card">
            <img src="${dish.image_url}" alt="${dish.name}" class="dish-image">
            <div class="dish-content">
                <div class="dish-name">${dish.name}</div>
                <div class="cuisine">Cuisine: ${dish.cuisine}</div>
                <div class="match-info">
                    <span class="match-percentage">${dish.match_percentage}% Match</span>
                    <span class="match-type ${dish.match_type === 'Exact Match' ? 'exact' : 'close'}">${dish.match_type}</span>
                </div>
                ${dish.missing_ingredients.length > 0 ? `
                <div class="missing-ingredients">
                    <span class="missing-label">Missing:</span>
                    ${missingChips}
                </div>
                ` : ''}
                <button class="view-recipe-btn" data-dish='${JSON.stringify(dish)}'>View Full Recipe</button>
            </div>
        </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const dish = JSON.parse(this.getAttribute('data-dish'));
            showRecipeModal(dish);
        });
    });
});

function showRecipeModal(dish) {
    const modal = document.getElementById('recipeModal');
    const recipeDetail = document.getElementById('recipeDetail');
    
    const stepsHtml = dish.steps.split('\n').map((step, i) => 
        `<div class="step"><span class="step-number">${i + 1}.</span> ${step}</div>`
    ).join('');
    
    recipeDetail.innerHTML = `
        <img src="${dish.image_url}" alt="${dish.name}" class="recipe-image">
        <div class="recipe-title">${dish.name}</div>
        <div class="recipe-cuisine">Cuisine: ${dish.cuisine}</div>
        <div class="match-info">
            <span class="match-percentage">${dish.match_percentage}% Match</span>
            <span class="match-type ${dish.match_type === 'Exact Match' ? 'exact' : 'close'}">${dish.match_type}</span>
        </div>
        ${dish.missing_ingredients.length > 0 ? `
        <div class="missing-ingredients">
            <span class="missing-label">Missing Ingredients:</span>
            ${dish.missing_ingredients.map(ing => `<span class="missing-chip">${ing}</span>`).join('')}
        </div>
        ` : ''}
        <h3>Instructions:</h3>
        <div class="recipe-steps">${stepsHtml}</div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('recipeModal').style.display = 'none';
});

// Close modal if clicked outside
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('recipeModal')) {
        document.getElementById('recipeModal').style.display = 'none';
    }
});
